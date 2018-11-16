# Sikkerhet-Ov10

## Oppgave 1:

For å kjøre programmet:
1. Åpne er terminal i mappen: opg1
2. Skriv: 'node app', for å starte serveren
3. Åpne: 'index.html' i en nettleser
4. Du skal se: 'Hello, World', i nettleseren, og i terminalen så kan du se klinten og serveren kjøre

## Forklaring:
Her har jeg laget en server i node.js (se: opg1/app.js), og en klient i javascript (se: opg1/js/scripts.js)

Klienten prøver først å logge inn med brukernavn: 'root', og passord: 'passord123'

Først henter klienten ut salt fra serveren. 

Når klienten får saltet, så hasher han passordet med saltet 1000 ganger.

Klienten sender så det hashede passordet til serveren

Serveren hasher passordet ytterligere på sin side, og sammenlikner det med hashen den har lagret på server siden.

Serveren gir så tilbakemelding om at innlogging lyktes. 

Serveren returnerer en tolken tilbake.

Klienten gjentar stegene over 1 gang til, men med en bruker med feil passord, og serveren gir tilbakemelding på at passordet ikke matcher

Tilslutt gjentar klienten prosessen 1 gang til, og får tilbakemelding om at innlogging lyktes

## Oppgave 2 del 1
I denne oppgaven så skal jeg laget et selv-signert SSL sertifikat med OpenSSL
Du finner sertifikatet under: opg2/server.crt, og nøkkelen under opg2/server.key

Dette gjorde jeg ved å åpne en terminal og skrive:

"openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -nodes -days 365 -subj '/CN=localhost'"

For å få dem over på .crt og .key format, så skrev jeg i terminalen:
"openssl rsa -outform der -in key.pem -out server.key", og 
"openssl x509 -outform der -in cert.pem -out server.crt"

## Oppgave 2 del 2
I denne oppgaven skal jeg sette opp en HTTPS tjeneste.

Jeg har tatt utgangspukt i [Simple-Web-Server](https://gitlab.com/eidheim/Simple-Web-Server).

For å kjøre serveren, kompiler prosjektet, og skriv: "./build/https_examples", i terminalen.

Det skal nå være mulig å åpne 'https://localhost:8080/', i nettleseren.

Dette gir normalt en feilmelding, men siden jeg la inn mitt sertifikat fra forrige oppgave i HttpsServer objektet (Simple-Web-Server/https_examples.cpp, linje 27)

