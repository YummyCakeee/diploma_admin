import React from 'react'

export enum loadableStatus {
    LOADING,
    SUCCESS,
    FAIL
}

type loadableProps = {
    status: loadableStatus,
    children: React.FC,
    onLoadingComponent?: React.FC,
    onFailComponent?: React.FC,
}

const Loadable: React.FC<loadableProps> = ({
    status = loadableStatus.SUCCESS,
    children,
    onLoadingComponent,
    onFailComponent
}) => {
    const LoadingComponent = onLoadingComponent || (() => <></>)
    const FailComponent = onFailComponent || (() => <></>)
    return (
        <>
            {status === loadableStatus.SUCCESS && children}
            {status === loadableStatus.LOADING && <LoadingComponent/>}
            {status === loadableStatus.FAIL && <FailComponent/>}
        </>
    )
}

export default Loadable