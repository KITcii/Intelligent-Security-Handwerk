package ish.user.model;

public enum RoleId {

    /**
     * User with standard access rights
     */
    USER,

    /**
     * Company owner with privileged access rights
     */
    OWNER,

    /**
     * Admin has no access to user space, only operating stuff
     */
    ADMIN;
}
