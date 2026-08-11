## DNS Security.txt


The DNS Security TXT Internet-Draft provides machine-readable records that define core attributes of your VDP using [DNS TXT records](https://en.wikipedia.org/wiki/TXT_record).

Publish every generated record at the normative `_security.<domain>` owner name. The records include your reporting contacts, policy URL, and the required expiry timestamp. Renew them before expiry and verify the authoritative response with the generated `dig` command.

For more information visit [https://dnssecuritytxt.org](https://dnssecuritytxt.org).
