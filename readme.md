Source: https://solana.com/developers/guides/token-extensions/getting-started

# Solana Token Extensions Guide

## Overview

The **Token Extensions Program** enhances the Solana Token Program with additional functionality.

- **Token Extensions Program ID**: `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb`
- **Original Token Program ID**: `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`

## Token Creation with CLI

Use the Solana Tool Suite CLI to create tokens with specific extensions. Below are the available extensions and their respective CLI flags:

### Mint-Based Extensions

| **Extension**          | **CLI Flag**                              |
| ---------------------- | ----------------------------------------- |
| Mint Close Authority   | `--enable-close`                          |
| Transfer Fees          | `--transfer-fee <basis points> <max fee>` |
| Non-Transferable       | `--enable-non-transferable`               |
| Interest-Bearing       | `--interest-rate <rate>`                  |
| Permanent Delegate     | `--enable-permanent-delegate`             |
| Transfer Hook          | `--transfer-hook <programID>`             |
| Metadata               | `--enable-metadata`                       |
| Metadata Pointer       | `--metadata-address <accountId>`          |
| Confidential Transfers | `--enable-confidential-transfers auto`    |

### Account-Based Extensions

| **Extension**             | **CLI Flag**                       |
| ------------------------- | ---------------------------------- |
| Immutable Owner           | Included by default                |
| Required Memo on Transfer | `--enable-required-transfer-memos` |
| CPI Guard                 | `--enable-cpi-guard`               |
| Default Account State     | `--default-account-state <state>`  |

---

## Creating a Token Example

To create a token with **Interest Rate** and **Metadata** extensions, use:

```bash
spl-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb \
  create-token --interest-rate 5 --enable-metadata
```

## Important Notes on Extensions

- **Extensions cannot be added after the token mint is created.**

### Incompatible Extension Combinations

Certain combinations either conflict or are impractical:

1. Non-transferable + (Transfer Hooks, Transfer Fees, Confidential Transfers)
2. Confidential Transfers + Fees (until version 1.18)
3. Confidential Transfers + Transfer Hooks (limited to source/destination accounts, without acting on transferred amounts)
4. Confidential Transfers + Permanent Delegate

---

## Transfer Hooks

Developers can replace standard transfer operations with custom logic using the **Transfer Hook Extension**.
