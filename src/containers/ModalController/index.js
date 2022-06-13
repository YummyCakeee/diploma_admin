import { LoadingIcon } from 'components/Elements/Icons/Index'
import ModalWindow from 'components/Elements/ModalWindow/ModalWindow'
import React, { createContext, Suspense, useState } from 'react'

const ConfirmActionModal = React.lazy(() => import('containers/Forms/ConfirmActionModal'))

export const ModalControllerContext = createContext()

const ModalController = ({children}) => {
    const [confirmActionModalState, setConfirmActionModalState] = useState(false)

    return(
        <ModalControllerContext.Provider
            value={{
                setConfirmActionModalState,
            }}
        >
            <ModalWindow
                isShowing={!!confirmActionModalState}
                setIshowing={setConfirmActionModalState}
            >
                <Suspense fallback={<LoadingIcon/>}>
                    <ConfirmActionModal 
                        {...{
                            ...confirmActionModalState
                        }}
                    />
                </Suspense>
            </ModalWindow>
            {children}
        </ModalControllerContext.Provider>
    )
}

export default ModalController