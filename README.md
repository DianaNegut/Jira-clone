# Jira-clone
## Workflow
### Guest:
- vizualizare pagini cu ceea ce ofera aplicatia
- pagina Pricing ofera recomandarea unui anumit plan in functie de numarul de persoane pe care utilizatorul il introduce
- popup-ul de login apare la apasarea la diferite butoane din aplicatie, dar si prin apasarea butonul de signup

### User fara drepturi de administartor:
- HOME: poate sa isi vada propriele taskuri asignate, dar si activitatea recenta pe care au avut-o colegii sai (din companie, platforma stie sa faca getsioneze mai multe companii)
- DASHBOARD: poate sa vada taskurile neasignate ale echipei sale, dar si sa asigneze unui utilizator din echipa sa. Atunci cand unui user ii este asignat un task, acesta este informat si pe email.
- TIMETRACKER: aici userul poate sa logheze timp la un anumite task (fac fetch pe taskurile pe care un user le are asignate si le afisez in dropdown) dupa care isi completeaza perioada in care a desfasurat activitate pentru acel task)
- BUG REPORT: aici un user creeaza un task pentru compania la care lucreaza si este asignat echipei alese ( afisez echipele disponibile din companie intr-un dropdown)
- ALEGE PLAN: aceasta pagina este disponibila numai daca userul NU are o companie asignata si vrea sa isi creeze propria companie (adica sa devina administrator). Dupa ce isi alege planul si este "efectuata" plata, se realizeze anumite verificari pe numarul de card, cvv si data expirarii dupa care este afisat mesajul de succes pentru efectuarea platii si are loc deconectarea userului. Acesta va fi redirectionat pe pagina principala unde va fi nevoit sa se logheze din nou.
- SETTINGS: aici userul isi vede numele si emailul care sunt RO si are posibilitatea sa isi schimbe parola
- TASK DETAILS: aceasta pagina afiseaza detaliile unui task. Aici se poate adauga si timp pentru un task direct din pagina taskului printr-un popup, nefiind nevoie sa acceseze pagine pentru time tracker. Poate sa asigneze taskul unei alte echipe (doar echipe) si sa adauge comentarii pentru un task. Poate sa modifice si descrierea unui task, iar toate modificarile pe care le face sunt salvate prin butonul de "Salveaza modificarile".
- VEZI TASKURI: aici un user vede o lista cu toate taskurile asignate DOAR echipei sale si statusul lor
- PROFILE: vizualizare profil

### User administrator:
- Adaugare User: aici un administrator poate crea un profil pentru un user nou. Acesta nu poate seta parola in mod direct, userul primeste pe email un token generat random si isi poate schimba parola ulterior.
- Adaugare user la echipa: aici, dupa un user a fost creat, acesta nu are asignata o echipa, si administratorul ii asigneaza o echipa.
- Statistici: sunt afisati numarul de utilizatori existenti si numarul de taskuri totale ale companiei
- Stegere Utilizator: se verifica daca emailul introdus face parte din compania curenta (compania administratorului) si sterge utilizatorul, daca nu arunca o eroare.
-  Adauga echipa: posibilitatea de a vizualiza echipele curente din companie si posibilitatea de a adauga noi team-uri
-  See all users: posibilitatea de a cauta un user dupa mai multe filtre si o lista cu toti userii care fac parte din companie
-  Vezi toate taskurile: filtrare taskuri disponibile si afisare lista cu toate taskurile din companie
-  Report Bug: aceeasi cu cea din user care nu e administrator
-  Settings: aceeasi cu cea din user care nu e administrator
-  Taskurile mele: aici administratorul isi poate vedea toate taskurile pe care le are asignate (la clic pe task se deschide pagina taskului Task Details ca la user fara drepturi de admin)
