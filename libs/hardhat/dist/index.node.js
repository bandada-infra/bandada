/**
 * @module @zk-groups/hardhat
 * @version 0.1.7
 * @file A Hardhat plugin which provides tasks to deploy ZKGroups contracts.
 * @copyright Ethereum Foundation 2022
 * @license MIT
 * @see [Github]{@link https://github.com/privacy-scaling-explorations/zk-groups/tree/main/libs/hardhat}
*/
'use strict';

var config = require('hardhat/config');
require('hardhat-dependency-compiler');
require('@nomiclabs/hardhat-ethers');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

config.task("deploy:zk-groups", "Deploy a ZKGroups contract")
    .addOptionalParam("logs", "Print the logs", true, config.types.boolean)
    .setAction(({ logs }, { ethers }) => __awaiter(void 0, void 0, void 0, function* () {
    const ZKGroupsFactory = yield ethers.getContractFactory("ZKGroups");
    const zkGroups = yield ZKGroupsFactory.deploy();
    yield zkGroups.deployed();
    if (logs) {
        console.info(`ZKGroups contract has been deployed to: ${zkGroups.address}`);
    }
    return zkGroups;
}));

config.task("deploy:zk-groups-semaphore", "Deploy a ZKGroupsSemaphore contract")
    .addOptionalParam("pairing", "Pairing library address", undefined, config.types.string)
    .addOptionalParam("semaphoreVerifier", "SemaphoreVerifier contract address", undefined, config.types.string)
    .addOptionalParam("zkGroups", "ZKGroups contract address", undefined, config.types.string)
    .addOptionalParam("logs", "Print the logs", true, config.types.boolean)
    .setAction(({ logs, pairing: pairingAddress, semaphoreVerifier: semaphoreVerifierAddress, zkGroups: zkGroupsAddress }, { ethers, run }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!semaphoreVerifierAddress) {
        if (!pairingAddress) {
            const PairingFactory = yield ethers.getContractFactory("Pairing");
            const pairing = yield PairingFactory.deploy();
            yield pairing.deployed();
            if (logs) {
                console.info(`Pairing library has been deployed to: ${pairing.address}`);
            }
            pairingAddress = pairing.address;
        }
        const SemaphoreVerifierFactory = yield ethers.getContractFactory("SemaphoreVerifier", {
            libraries: {
                Pairing: pairingAddress
            }
        });
        const semaphoreVerifier = yield SemaphoreVerifierFactory.deploy();
        yield semaphoreVerifier.deployed();
        if (logs) {
            console.info(`SemaphoreVerifier contract has been deployed to: ${semaphoreVerifier.address}`);
        }
        semaphoreVerifierAddress = semaphoreVerifier.address;
    }
    if (!zkGroupsAddress) {
        const zkGroups = yield run("deploy:zk-groups", { logs });
        zkGroupsAddress = zkGroups.address;
    }
    const ZKGroupsSemaphoreFactory = yield ethers.getContractFactory("ZKGroupsSemaphore");
    const zkGroupsSemaphore = yield ZKGroupsSemaphoreFactory.deploy(semaphoreVerifierAddress, zkGroupsAddress);
    yield zkGroupsSemaphore.deployed();
    if (logs) {
        console.info(`ZKGroupsSemaphore contract has been deployed to: ${zkGroupsSemaphore.address}`);
    }
    return zkGroupsSemaphore;
}));

config.extendConfig((config, userConfig) => {
    var _a;
    config.dependencyCompiler.paths = [
        "@zk-groups/contracts/ZKGroups.sol",
        "@zk-groups/contracts/protocols/ZKGroupsSemaphore.sol",
        "@semaphore-protocol/contracts/base/Pairing.sol",
        "@semaphore-protocol/contracts/base/SemaphoreVerifier.sol"
    ];
    if ((_a = userConfig.dependencyCompiler) === null || _a === void 0 ? void 0 : _a.paths) {
        config.dependencyCompiler.paths = [
            ...config.dependencyCompiler.paths,
            ...userConfig.dependencyCompiler.paths
        ];
    }
});
