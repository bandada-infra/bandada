---
sidebar_position: 4
title: Multiple credentials access
---

# Muleiple credentials access

## Create an off-chain group with multiple credentials access

1. To create an off-chain group with multiple credentials access, select `Multiple credentials` access mode.

![Create off-chain group multiple credentials access](../../../../static/img/tutorial/offchain-mult-credentials.png)

2. You can select multiple types of credentials for the off-chain group so that only users that fit the criteria can join the group. Users can use parentheses and logical operators such as `AND`, `OR`, `NOT` and `XOR` to chain multiple credentials together. Currently supported credentials and providers are:
    - **Provider**: GitHub.
        - **Credential**: Followers.  
        **Input**: Minimum followers.
        - **Credential**: Personal stars.  
        **Input**: Minimum stars.
        - **Credential**: Repository commits.  
        **Input**: Minimum commits, repository details.
    - **Provider**: Twitter (X).
        - **Credential**: Followers.  
        **Input**: Minimum followers.
        - **Credential**: Following user.  
        **Input**: Username.
    - **Provider**: Blockchain.
        - **Credential**: Transactions.  
        **Input**: Minimum transactions, network, block number.
        - **Credential**: Balance.  
        **Input**: Minimum balance, network, block number.
    - **Provider**: EAS.
        - **Credential**: Attestations.  
        **Input**: Minimum attestations, network, attestation details.  
4. Click `Continue` to proceed.
5. You will be redirected to the `Group Preview` page to review the group details.
6. Click `Create Group` to finalize the group creation.

![Create off-chain group preview](../../../../static/img/tutorial/offchain-preview.png)

Congratulations! You have successfully created an off-chain multiple credentials access group!