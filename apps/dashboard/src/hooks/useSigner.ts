import { useEffect, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { providers, Signer } from "ethers"

const useSigner = () => {
    const [signer, setSigner] = useState<Signer>()
    const { account, library } = useWeb3React<providers.Web3Provider>()
    useEffect(() => {
        if (!library || !account) return

        setSigner(library.getSigner(account))
    }, [account, library])

    return signer
}

export default useSigner
