'use client'
import { useState } from "react"
import ConnectCollaborate from "./connect-collaborate"
import DiscoveryFeed from "./discovery"
import Connections from "./connections"

const maxStepsInLevel = 3

export function Level3() {

    const [step, setStep] = useState(1)

    const handleNextStep = async () => {
        if (step < maxStepsInLevel) {
            setStep(step + 1)
        } else {
            // handleCompleteLevel()
        }
    }

    const handleSteps = (step: number) => {
        setStep(step)
    }

    return (
        <>
            <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-4xl mx-auto">
                    {step === 1 &&
                        <ConnectCollaborate setStep={handleNextStep} />
                    }
                    {step === 2 && (
                        <DiscoveryFeed setStep={handleNextStep} />
                    )}
                    {step === 3 && (
                        <Connections setStep={handleSteps} />
                    )}
                </div>
            </div>
        </>
    )
}