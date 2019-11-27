import { useMemo } from "react";
import { Page } from "UtilsCommon";

export default actionNames => {
    return useMemo(() => actionNames.map(m => Page.Current.Invoke("RootPage", m)), [actionNames]);
}