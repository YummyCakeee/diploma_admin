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

    return (
        <>
            {status === loadableStatus.SUCCESS && children}
            {status === loadableStatus.LOADING && onLoadingComponent}
            {status === loadableStatus.FAIL && onFailComponent}
        </>
    )
}

export default Loadable