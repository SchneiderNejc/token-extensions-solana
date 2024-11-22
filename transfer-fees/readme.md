# Token-2022 Transfer Fees

With **Token-2022**, transfer fees can be configured at the protocol level, ensuring fees are automatically assessed on every transfer. A portion of the tokens is withheld on the recipient account, and these withheld tokens are managed by a specific authority.

## Key Fields in Transfer Fee Configuration

- **Fee in Basis Points**: A percentage of the transfer amount, e.g., 50 basis points on 1,000 tokens results in a 5-token fee.
- **Maximum Fee**: A cap on the transfer fee, e.g., a maximum fee of 5,000 tokens limits deductions regardless of transfer size.
- **Transfer Fee Authority**: The entity authorized to modify fees.
- **Withdraw Withheld Authority**: The entity authorized to manage withheld tokens.

---

## Important Notes

- **Transfer Method**: Use `transfer_checked` or `transfer_checked_with_fee` commands; standard `transfer` will fail if fees are applied.

---

## CLI Examples

### Creating a Mint

```bash
$ spl-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb create-token --transfer-fee 50 5000
```

### Transferring tokens with the fee checked

```bash
$ spl-token create-account Dg3i18BN7vzsbAZDnDv3H8nQQjSaPUTqhwX41J7NZb5H
$ spl-token mint Dg3i18BN7vzsbAZDnDv3H8nQQjSaPUTqhwX41J7NZb5H 1000000000
$ spl-token transfer --expected-fee 0.000005
Dg3i18BN7vzsbAZDnDv3H8nQQjSaPUTqhwX41J7NZb5H 1000000 destination.json
```

### Find accounts with withheld tokens

```bash
CLI support coming soon!
```

### Withdraw withheld tokens from accounts

```bash
$ spl-token withdraw-withheld-tokens 7UKuG4W68hW9eGrDms6BenRf8DCEHKGN49xewtWyB5cx 5wY8fiMZG5wGbQmtzKgqqEEp4vsCMJZ53RXEagUUWhEr
```

### Harvest withheld tokens to mint

```bash
$ spl-token close --address 5wY8fiMZG5wGbQmtzKgqqEEp4vsCMJZ53RXEagUUWhEr
```

### Withdraw withheld tokens from mint

```bash
$ spl-token withdraw-withheld-tokens --include-mint 7UKuG4W68hW9eGrDms6BenRf8DCEHKGN49xewtWyB5cx
```
