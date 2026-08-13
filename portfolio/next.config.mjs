/** @type {import('next').NextConfig} */
const nextConfig = {
  // Deliberately NOT setting `typescript.ignoreBuildErrors`. Both cloned sites
  // needed that flag to build at all — every generated component imports a
  // `../_styles` module that does not exist — so a green build there proved
  // nothing. Here the build failing on a type error is the point.
  outputFileTracingRoot: import.meta.dirname,
};

export default nextConfig;
