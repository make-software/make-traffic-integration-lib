import React from "react";
import {Campaign} from "make-traffic-integration-core";


export const DefaultTaskCard = (campaign: Campaign, actions: { go: () => void; claim: () => void }) => {

    const getIconByType = (type: number) => {
        switch (type) {
            default:
                return "assets/icons/telegram.png";
        }
    }

    const getPrizeIconByType = (type: string) => {
        switch (type) {
            default:
                return "assets/icons/coin.png";
        }
    }


    const cardBGColor = (campaign: Campaign) => {
        return campaign.isCompleted ? "bg-gray-200" : "bg-white";
    }

    return (
        <div key={campaign.task.id}
             className={`task card ${cardBGColor(campaign)} shadow-xl rounded-lg mb-4 w-full sm:w-1/2 lg:w-1/2 xl:w-1/3`}
        >
            <div className="card-body p-4">
                <h5 className="card-title text-xl font-semibold flex items-center text-gray-800">
                    <img
                        src={getIconByType(campaign.task.pluginID)}
                        alt="icon"
                        className="w-10 h-10 mr-3"
                    />
                    {campaign.task.name}
                </h5>
                <p className="card-text text-gray-600">
                    Earn{" "}
                    <img
                        src={getPrizeIconByType(campaign.settings.rewards[0].type)}
                        alt={campaign.settings.rewards[0].type}
                        className="inline-block w-8 h-8 mr-2"
                    />
                    {campaign.settings.rewards[0].value}
                </p>
                <div className="mt-4">
                    <button
                        disabled={campaign.isCompleted}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition mr-2"
                        onClick={() => actions.go}
                    >
                        Go
                    </button>
                    {campaign.isClaimAvailable && (
                        <button
                            disabled={campaign.isCompleted}
                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                            onClick={() => actions.claim}
                        >
                            Claim
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}