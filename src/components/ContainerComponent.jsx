import { useEffect, useState } from "react";
import "../styles.css";
import SwapComponent from "./SwapComponent";
import ProvideComponent from "./ProvideComponent";
import WithdrawComponent from "./WithdrawComponent";
import FaucetComponent from "./FaucetComponent";
import { PRECISION } from "../constants";

export default function ContainerComponent(props) {
    const [activeTab, setActiveTab] = useState("Swap");
    const [amountOfKAR, setAmountOfKAR] = useState(0);
    const [amountOfKOTHI, setAmountOfKOTHI] = useState(0);
    const [amountOfShare, setAmountOfShare] = useState(0);
    const [totalKAR, setTotalKAR] = useState(0);
    const [totalKOTHI, setTotalKOTHI] = useState(0);
    const [totalShare, setTotalShare] = useState(0);

    useEffect(() => {
        getHoldings();
    });

    // Fetch the pool details and personal assets details.
    async function getHoldings() {
        try {
            await props.contract.query.getMyHoldings(props.activeAccount.address, {value:0, gasLimit:-1}).then(res => res.output.toHuman())
            .then(res => {
                setAmountOfKAR(res[0].replace(/,/g, '') / PRECISION);
                setAmountOfKOTHI(res[1].replace(/,/g, '') / PRECISION);
                setAmountOfShare(res[2].replace(/,/g, '') / PRECISION);
            });
            await props.contract.query.getPoolDetails(props.activeAccount.address, {value:0,gasLimit:-1}).then(res => res.output.toHuman())
            .then(res => {
                setTotalKAR(res[0].replace(/,/g, '') / PRECISION);
                setTotalKOTHI(res[1].replace(/,/g, '') / PRECISION);
                setTotalShare(res[2].replace(/,/g, '') / PRECISION);
            });
            
        } catch (err) {
            console.log("Couldn't Fetch holdings", err);
        }
    }

    const changeTab = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="centerBody">
            <div className="centerContainer">
                <div className="selectTab">
                    <div
                        className={"tabStyle " + (activeTab === "Swap" ? "activeTab" : "")}
                        onClick={() => changeTab("Swap")}
                    >
                        Swap
                    </div>
                    <div
                        className={
                            "tabStyle " + (activeTab === "Provide" ? "activeTab" : "")
                        }
                        onClick={() => changeTab("Provide")}
                    >
                        Provide
                    </div>
                    <div
                        className={
                            "tabStyle " + (activeTab === "Withdraw" ? "activeTab" : "")
                        }
                        onClick={() => changeTab("Withdraw")}
                    >
                        Withdraw
                    </div>
                    <div
                        className={
                            "tabStyle " + (activeTab === "Faucet" ? "activeTab" : "")
                        }
                        onClick={() => changeTab("Faucet")}
                    >
                        Faucet
                    </div>
                </div>

                {activeTab === "Swap" && (
                    <SwapComponent
                        contract={props.contract}
                        getHoldings={() => getHoldings()}
                        activeAccount={props.activeAccount}
                        signer={props.signer}
                    />
                )}
                {activeTab === "Provide" && (
                    <ProvideComponent
                        contract={props.contract}
                        getHoldings={() => getHoldings()}
                        activeAccount={props.activeAccount}
                        signer={props.signer}
                    />
                )}
                {activeTab === "Withdraw" && (
                    <WithdrawComponent
                        contract={props.contract}
                        maxShare={amountOfShare}
                        getHoldings={() => getHoldings()}
                        activeAccount={props.activeAccount}
                        signer={props.signer}
                    />
                )}
                {activeTab === "Faucet" && (
                    <FaucetComponent
                        contract={props.contract}
                        getHoldings={() => getHoldings()}
                        activeAccount={props.activeAccount}
                        signer={props.signer}
                    />
                )}
            </div>
            <div className="details">
                <div className="detailsBody">
                    <div className="detailsHeader">Details</div>
                    <div className="detailsRow">
                        <div className="detailsAttribute">Amount of KAR:</div>
                        <div className="detailsValue">{amountOfKAR}</div>
                    </div>
                    <div className="detailsRow">
                        <div className="detailsAttribute">Amount of KOTHI:</div>
                        <div className="detailsValue">{amountOfKOTHI}</div>
                    </div>
                    <div className="detailsRow">
                        <div className="detailsAttribute">Your Share:</div>
                        <div className="detailsValue">{amountOfShare}</div>
                    </div>
                    <div className="detailsHeader">Pool Details</div>
                    <div className="detailsRow">
                        <div className="detailsAttribute">Total KAR:</div>
                        <div className="detailsValue">{totalKAR}</div>
                    </div>
                    <div className="detailsRow">
                        <div className="detailsAttribute">Total KOTHI:</div>
                        <div className="detailsValue">{totalKOTHI}</div>
                    </div>
                    <div className="detailsRow">
                        <div className="detailsAttribute">Total Shares:</div>
                        <div className="detailsValue">{totalShare}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}