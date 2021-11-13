import { useState } from "react";
import { abi, CONTRACT_ADDRESS } from "./constants";
import ContainerComponent from "./components/ContainerComponent";
import "./styles.css";

import {ApiPromise, WsProvider} from '@polkadot/api';
import {ContractPromise} from '@polkadot/api-contract';
import {web3Accounts, web3Enable, web3FromSource} from '@polkadot/extension-dapp';

export default function App() {
    const [myContract, setMyContract] = useState(null);
    const [activeAccount, setActiveAccount] = useState();
    const [signer, setSigner] = useState(null);
    const blockchainUrl = 'ws://127.0.0.1:9944';

    async function connect() {
        try {
            console.log("----- Connect called -----");
            const wsProvider = new WsProvider(blockchainUrl);
            const api = await ApiPromise.create({provider: wsProvider});
            await extensionSetup();
            const contract = new ContractPromise(api, abi, CONTRACT_ADDRESS);
            setMyContract(contract);
        } catch(err) {
            console.log("Couldn't connect to wallet :- ", err);
        }
    }

    const extensionSetup = async () => {
        try {
            const extensions = await web3Enable('Local Canvas');
            if (extensions.length === 0) {
                return;
            }
            let selectedAccount = (await web3Accounts())[0];
            setActiveAccount(selectedAccount);
            setSigner(await web3FromSource(selectedAccount.meta.source).then(res => res.signer));
        } catch(err) {
            alert("Extension setup failed");
            console.log("Extension setup failed", err);
        }
    };

    return (
        <div className="pageBody">
            <div className="navBar">
                <div className="appName"> AMM </div>
                {myContract === null ? (
                    <div className="connectBtn" onClick={() => connect()}>
                        {" "}
                        Connect your wallet{" "}
                    </div>
                ) : (
                    <div className="connected"> {"Connected to " + activeAccount?.address} </div>
                )}
            </div>
            <ContainerComponent contract={myContract} connect={() => connect()} activeAccount={activeAccount} signer={signer}/>
        </div>
    );
}