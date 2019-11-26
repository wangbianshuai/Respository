import { useMemo } from "react";
import { Page } from "UtilsCommon";

export default actionNames => {
    const actionList = useMemo(() => {
        return actionNames.map(m => Page.Current.Invoke("RootPage", m))
    }, [actionNames])

    return actionList
}