## Security.txt


Security.txt is an RFC 9116 machine-readable file that publishes the contact and policy information for your vulnerability disclosure program.

Publish the generated file at `https://<domain>/.well-known/security.txt`. Serve it over HTTPS with a `Content-Type` of `text/plain; charset=UTF-8`. RFC 9116 requires the `/.well-known/security.txt` location for web services; `/security.txt` exists only for compatibility with the earlier specification.

The generated expiry is 364 days from creation. Schedule a renewal before that date so automated discovery does not treat the file as stale.

For more information visit [https://securitytxt.org](https://securitytxt.org) and the associated [RFC9116](https://www.rfc-editor.org/rfc/rfc9116).
