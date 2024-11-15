export const getAgentUserInfo = (userAgent) => {
    if (!userAgent)
        return undefined;
    const [pkgSpec, nodeSpec] = userAgent.split(' ');
    if (!pkgSpec || !nodeSpec)
        return undefined;
    const [pkgManager, pkgVersion] = pkgSpec.split('/');
    const [node, nodeVersion] = nodeSpec.split('/');
    return { pkgManager, pkgVersion, node, nodeVersion };
};
