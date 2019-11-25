import styles from './index.css';
import { ModalDialog } from "ReactCommon";
import { Common } from "UtilsCommon";
import { useCallback, useState, useMemo } from 'react';

export default function () {
  const [dialogList, setDialogList] = useState([]);

  const property = useMemo(() => {
    return {
      Title: "Dialog Test",
      Component: GetComponent(),
      OnOk: (e, p) => p.SetVisible(false)
    }
  }, []);

  const showModal = useCallback(() => {
    if (property.SetVisible === undefined) {
      dialogList.push(<ModalDialog key={Common.CreateGuid()} Property={property} />)
      setDialogList(dialogList.map(m => m))
    }
    else property.SetVisible(true)
  }, [property, dialogList]);

  return (
    <div className={styles.normal}>
      <div className={styles.welcome} />
      <button onClick={showModal}>ShowModal</button>
      <ul className={styles.list}>
        <li>To get started, edit <code>src/pages/index.js</code> and save to reload.</li>
        <li>
          <a href="https://umijs.org/guide/getting-started.html">
            Getting Started
          </a>
        </li>
      </ul>
      {dialogList}
    </div>
  );
}


function GetComponent() {
  return (<div>content</div>)
}