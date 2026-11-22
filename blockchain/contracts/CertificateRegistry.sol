// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CertificateRegistry
 * @dev Enterprise-grade decentralized certificate verification registry.
 * Employs Role-Based Access Control (RBAC) via OpenZeppelin.
 * Strictly guarantees that no personal identifiable information (PII) is stored on-chain.
 * Only cryptographic SHA-256 hashes and proof-of-authenticity metadata are recorded.
 */
contract CertificateRegistry is AccessControl, ReentrancyGuard {
    bytes32 public constant UNIVERSITY_ROLE = keccak256("UNIVERSITY_ROLE");

    struct University {
        string name;
        string code;
        bool isActive;
        bool exists;
        uint256 registeredAt;
    }

    struct Certificate {
        bytes32 certificateHash; // SHA-256 cryptographic digest of canonical document
        address issuer;          // Authorized institutional wallet that issued the certificate
        uint256 issuedAt;        // Unix timestamp when registered on-chain
        bool exists;             // Verification existence flag
        bool revoked;            // Revocation state flag
        string revocationReason; // Documented revocation justification
        uint256 revokedAt;       // Revocation timestamp
    }

    // Mapping from university wallet address to institution details
    mapping(address => University) private _universities;

    // Mapping from unique certificate identifier (bytes32) to on-chain certificate record
    mapping(bytes32 => Certificate) private _certificates;

    // Mapping to prevent hash collision or duplicate issuance of the same physical document
    mapping(bytes32 => bytes32) private _hashToCertId;

    // Tracking counters
    uint256 public totalCertificatesIssued;
    uint256 public totalCertificatesRevoked;
    uint256 public totalUniversitiesRegistered;

    // Custom Errors for gas optimization and precision
    error UniversityAlreadyExists(address account);
    error UniversityNotFound(address account);
    error UniversityNotActive(address account);
    error CertificateAlreadyExists(bytes32 certId);
    error CertificateHashAlreadyRegistered(bytes32 certificateHash);
    error CertificateNotFound(bytes32 certId);
    error CertificateAlreadyRevoked(bytes32 certId);
    error UnauthorizedRevoker(address caller);
    error InvalidZeroAddress();
    error InvalidEmptyParameter();

    // Events
    event UniversityRegistered(
        address indexed universityAddress,
        string name,
        string code,
        uint256 timestamp
    );

    event UniversityStatusUpdated(
        address indexed universityAddress,
        bool isActive,
        uint256 timestamp
    );

    event CertificateIssued(
        bytes32 indexed certId,
        bytes32 indexed certificateHash,
        address indexed issuer,
        uint256 issuedAt
    );

    event CertificateRevoked(
        bytes32 indexed certId,
        address indexed revoker,
        string reason,
        uint256 revokedAt
    );

    /**
     * @dev Initializes contract setting deployer as DEFAULT_ADMIN_ROLE.
     */
    constructor(address initialAdmin) {
        if (initialAdmin == address(0)) revert InvalidZeroAddress();
        _grantRole(DEFAULT_ADMIN_ROLE, initialAdmin);
    }

    // =========================================================================
    // UNIVERSITY MANAGEMENT
    // =========================================================================

    /**
     * @notice Registers a new authorized university in the registry.
     * @dev Restricted to DEFAULT_ADMIN_ROLE (Super Admin).
     */
    function registerUniversity(
        address universityAddress,
        string calldata name,
        string calldata code
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (universityAddress == address(0)) revert InvalidZeroAddress();
        if (bytes(name).length == 0 || bytes(code).length == 0) revert InvalidEmptyParameter();
        if (_universities[universityAddress].exists) revert UniversityAlreadyExists(universityAddress);

        _universities[universityAddress] = University({
            name: name,
            code: code,
            isActive: true,
            exists: true,
            registeredAt: block.timestamp
        });

        _grantRole(UNIVERSITY_ROLE, universityAddress);
        totalUniversitiesRegistered++;

        emit UniversityRegistered(universityAddress, name, code, block.timestamp);
    }

    /**
     * @notice Updates the active status of a university (suspend or reactivate).
     * @dev Restricted to DEFAULT_ADMIN_ROLE.
     */
    function setUniversityStatus(
        address universityAddress,
        bool isActive
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (!_universities[universityAddress].exists) revert UniversityNotFound(universityAddress);

        _universities[universityAddress].isActive = isActive;

        if (isActive) {
            _grantRole(UNIVERSITY_ROLE, universityAddress);
        } else {
            _revokeRole(UNIVERSITY_ROLE, universityAddress);
        }

        emit UniversityStatusUpdated(universityAddress, isActive, block.timestamp);
    }

    /**
     * @notice Queries university metadata.
     */
    function getUniversity(
        address universityAddress
    ) external view returns (
        string memory name,
        string memory code,
        bool isActive,
        bool exists,
        uint256 registeredAt
    ) {
        University memory uni = _universities[universityAddress];
        return (uni.name, uni.code, uni.isActive, uni.exists, uni.registeredAt);
    }

    /**
     * @notice Helper to check if an address is an active registered university.
     */
    function isUniversityActive(address universityAddress) external view returns (bool) {
        return _universities[universityAddress].exists && _universities[universityAddress].isActive;
    }

    // =========================================================================
    // CERTIFICATE ISSUANCE & REVOCATION
    // =========================================================================

    /**
     * @notice Issues a new certificate by permanently anchoring its SHA-256 fingerprint.
     * @dev Restricted to active authorized university addresses.
     * @param certId Unique bytes32 certificate identifier.
     * @param certificateHash Cryptographic SHA-256 hash of the canonical certificate file.
     */
    function issueCertificate(
        bytes32 certId,
        bytes32 certificateHash
    ) external onlyRole(UNIVERSITY_ROLE) nonReentrant {
        if (!_universities[msg.sender].isActive) revert UniversityNotActive(msg.sender);
        if (certId == bytes32(0) || certificateHash == bytes32(0)) revert InvalidEmptyParameter();
        if (_certificates[certId].exists) revert CertificateAlreadyExists(certId);
        if (_hashToCertId[certificateHash] != bytes32(0)) revert CertificateHashAlreadyRegistered(certificateHash);

        _certificates[certId] = Certificate({
            certificateHash: certificateHash,
            issuer: msg.sender,
            issuedAt: block.timestamp,
            exists: true,
            revoked: false,
            revocationReason: "",
            revokedAt: 0
        });

        _hashToCertId[certificateHash] = certId;
        totalCertificatesIssued++;

        emit CertificateIssued(certId, certificateHash, msg.sender, block.timestamp);
    }

    /**
     * @notice Revokes an issued certificate.
     * @dev Can only be called by the issuing university or a contract super admin.
     * @param certId Unique identifier of the certificate to revoke.
     * @param reason Documented audit explanation for revocation.
     */
    function revokeCertificate(
        bytes32 certId,
        string calldata reason
    ) external nonReentrant {
        Certificate storage cert = _certificates[certId];
        if (!cert.exists) revert CertificateNotFound(certId);
        if (cert.revoked) revert CertificateAlreadyRevoked(certId);
        if (bytes(reason).length == 0) revert InvalidEmptyParameter();

        // Enforce permission: Issuer OR Super Admin
        bool isIssuer = (msg.sender == cert.issuer);
        bool isAdmin = hasRole(DEFAULT_ADMIN_ROLE, msg.sender);
        if (!isIssuer && !isAdmin) revert UnauthorizedRevoker(msg.sender);

        cert.revoked = true;
        cert.revocationReason = reason;
        cert.revokedAt = block.timestamp;
        totalCertificatesRevoked++;

        emit CertificateRevoked(certId, msg.sender, reason, block.timestamp);
    }

    // =========================================================================
    // VERIFICATION & AUDIT QUERIES
    // =========================================================================

    /**
     * @notice Performs public mathematical verification of a certificate.
     * @param certId Unique certificate identifier.
     * @param certificateHash SHA-256 hash calculated from document.
     * @return isValid True if document hash precisely matches on-chain registration and is unrevoked.
     * @return isRevoked True if certificate was officially revoked.
     * @return issuer Address of the issuing institution.
     * @return issuedAt Unix timestamp of on-chain registration.
     */
    function verifyCertificate(
        bytes32 certId,
        bytes32 certificateHash
    ) external view returns (
        bool isValid,
        bool isRevoked,
        address issuer,
        uint256 issuedAt
    ) {
        Certificate memory cert = _certificates[certId];
        if (!cert.exists) {
            return (false, false, address(0), 0);
        }

        bool hashMatches = (cert.certificateHash == certificateHash);
        bool valid = hashMatches && !cert.revoked;

        return (valid, cert.revoked, cert.issuer, cert.issuedAt);
    }

    /**
     * @notice Retrieves the full record of an on-chain certificate.
     */
    function getCertificate(
        bytes32 certId
    ) external view returns (
        bytes32 certificateHash,
        address issuer,
        uint256 issuedAt,
        bool exists,
        bool revoked,
        string memory revocationReason,
        uint256 revokedAt
    ) {
        Certificate memory cert = _certificates[certId];
        return (
            cert.certificateHash,
            cert.issuer,
            cert.issuedAt,
            cert.exists,
            cert.revoked,
            cert.revocationReason,
            cert.revokedAt
        );
    }

    /**
     * @notice Resolves a certificate ID from a certificate hash.
     */
    function getCertIdByHash(bytes32 certificateHash) external view returns (bytes32) {
        return _hashToCertId[certificateHash];
    }
}
