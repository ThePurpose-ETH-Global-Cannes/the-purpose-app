'use client'
import ConnectCollaborate from './connect-collaborate'

const maxStepsInLevel = 1

interface Level3Props {
    step: number;
    setStep: (step: number) => void;
    handleCompleteLevel: () => void;
}

export function Level3({ step, setStep, handleCompleteLevel }: Level3Props) {
    const handleNextStep = async () => {
        if (step < maxStepsInLevel) {
            setStep(step + 1)
        } else {
            handleCompleteLevel()
        }
    }

    return (
        <div className="flex-1 overflow-y-auto p-6">
            <div className="container mx-auto">
                {step === 1 && (
                    <ConnectCollaborate setStep={handleNextStep} />
                )}
            </div>
        </div>
    )
}