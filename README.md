# Jira-clone
## Workflow
### Guest:
- vizualizare pagini cu ceea ce ofera aplicatia
- pagina Pricing ofera recomandarea unui anumit plan in functie de numarul de persoane pe care utilizatorul il introduce
- popup-ul de login apare la apasarea la diferite butoane din aplicatie, dar si prin apasarea butonul de signup

### User fara drepturi de administartor:
- PRIMA PAGINA: poate sa isi vada propriele taskuri asignate, dar si activitatea recenta pe care au avut-o colegii sai (din companie, platforma stie sa faca getsioneze mai multe companii)
- A DOUA PAGINA: poate sa vada taskurile neasignate ale echipei sale, dar si sa asigneze unui utilizator din echipa sa. Atunci cand unui user ii este asignat un task, acesta este informat si pe email.
- TIMETRACKER: aici userul poate sa logheze timp la un anumite task (fac fetch pe taskurile pe care un user le are asignate si le afisez in dropdown) dupa care isi completeaza perioada in care a desfasurat activitate pentru acel task)
- BUG REPORT: aici un user creeaza un task pentru compania la care lucreaza si este asignat echipei alese ( afisez echipele disponibile din companie intr-un dropdown)
- ALEGE PLAN: aceasta pagina este disponibila numai daca userul NU are o companie asignata si vrea sa isi creeze propria companie (adica sa devina administrator). Dupa ce isi alege planul si este "efectuata" plata, se realizeze anumite verificari pe numarul de card, cvv si data expirarii dupa care este afisat mesajul de succes pentru efectuarea platii si are loc deconectarea userului. Acesta va fi redirectionat pe pagina principala unde va fi nevoit sa se logheze din nou.
- SETTINGS: aici userul isi vede numele si emailul care sunt RO si are posibilitatea sa isi schimbe parola
- TASK DETAILS: aceasta pagina afiseaza detaliile unui task. Aici se poate adauga si timp pentru un task direct din pagina taskului printr-un popup, nefiind nevoie sa acceseze pagine pentru time tracker. Poate sa asigneze taskul unei alte echipe (doar echipe) si sa adauge comentarii pentru un task. Poate sa modifice si descrierea unui task, iar toate modificarile pe care le face sunt salvate prin butonul de "Salveaza modificarile".
