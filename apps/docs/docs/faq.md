---
sidebar_position: 4
---

# FAQ

## Where can I ask questions about Bandada?

You can ask questions about Bandada in the [PSE Discord](https://discord.com/invite/sF5CT5rzrR), there is a channel for it called `bandada` or by opening a [Bandada Discussion](https://github.com/orgs/bandada-infra/discussions). 

The most frequently asked questions will be listed below.

## How can I start a project using Bandada?

There are 3 ways you can start using Bandada in your project: 

- [API](https://api.bandada.pse.dev/)

This is a good option if you are not using TypeScript/JavaScript and want to interact with the Bandada infrastructure.

- [API SDK](https://github.com/bandada-infra/bandada/tree/main/libs/api-sdk)

This is a good option if you are using TypeScript/JavaScript and want to interact with the Bandada infrastructure.

- [Boilerplate](https://github.com/bandada-infra/boilerplate)

This is a good option if you want to quickly create a Bandada project because you can fork it, clone it or use it as a template.

## What is the difference between Semaphore and Bandada?

[Semaphore](https://semaphore.pse.dev/) is a zero-knowledge protocol that allows users to prove their membership in a group and send messages, such as votes or feedback, without revealing their identity. It also provides a simple mechanism to prevent double-signaling. Semaphore works both off-chain and on EVM-compatible chains.

[Bandada](https://bandada.pse.dev/) is an infrastructure for managing privacy-preserving groups. It also provides anti-sybil mechanisms by using credential groups, ensuring that only users meeting specific criteria can join a group.

Semaphore lacks an off-chain infrastructure for managing groups or storing group members, but Bandada fills this gap by simplifying the management of off-chain Semaphore groups. Though Semaphore and Bandada groups are different, they are fully compatible and work well together.

Joining a Semaphore group often requires an anti-sybil mechanism. Bandada integrates this functionality through its credentials package and invite codes functionality.

Bandada is well-suited for managing large groups, as it enables server-side creation of Merkle proofs, an approach that is especially useful when the group size is too large for client-side processing.

While Bandada does not have integrated zero-knowledge (zk) capabilities, it can be paired with Semaphore to add zk functionality to an application.

Semaphore provides a robust on-chain infrastructure for groups, which Bandada leverages for its own on-chain group management.

In summary, Semaphore and Bandada serve different purposes and offer distinct functionalities, but they are fully compatible and work effectively together.
