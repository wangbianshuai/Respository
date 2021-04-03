import React from 'react';
import { router } from "dva";
import EnvConfig from './envConfig';

const { Link } = router;

const wetRootPath = EnvConfig.getServiceUrl('WebRootPath')();
const getPath = (path) => (wetRootPath + path);

export default ({ to, children }) => <Link to={getPath(to)}>{children}</Link>