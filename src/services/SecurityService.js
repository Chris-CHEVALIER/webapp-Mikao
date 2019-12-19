
import LoginStore from 'stores/LoginStore';

/**
 * Service to use the security context of the user.
 */
class SecurityService {
    /**
     * Check if the user is allowed to access a module with an access level.
     * @param {string} moduleName The module to check. (see constants/moduleName.js)
     * @param {number} accessibility The access level. (see constants/Accessibility.js)
     * @returns {boolean} TRUE if the user is allowed, else FALSE.
     */
    static isGranted(moduleName, accessibility) {
        const user = LoginStore.getUser();
        const securityContext = LoginStore.getSecurityContext();
        return (
            (!!user && user.isSuperAdmin) ||
            (!!securityContext && (securityContext[moduleName] & accessibility) !== 0)
        );
    }
}

export default SecurityService;
