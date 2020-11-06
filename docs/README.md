
## Workflow
1. Pull Request (najlepiej do środy)
    - **MAŁE** zmiany (do 5 plików i 300 linijek, chyba, że generowane - wtedy napisać które pliki są generowane automatycznie)
    - Review powinno zająć do 20-30 minut
    - Reviewer musi odpalić kod
    - Od 1 do 2 reviewerów
        - Wybieramy na podstawie listy dostępności
        Idealnie: 
        - Jedna osoba co jest krócej w projekcie
        - Jedna osoba co jest dłużej
    - Komentarze w PR mile widziane jeśli kod jest trudny, link z issue jeśli kopiujemy z stackoverflow
2. Reviewerzy mają 1 dzień na zrobienie review
    - Reviewerzy są odpowiedzialni za pingowanie twórcy, żeby wprowadził zmiany
    - Twórca ma 1 dzień na odniesienie się do komentarzy (zmiany może wprowadzić później)
3. Jeden z reviewerów (ten co ostatni approvuje patrzy) merguje PR do developa

Jeśli PR jest specyficzny, można nagiąć zasady !

## List of availability
Dni oznaczone krzyżykiem - to dni w których reviewer nie jest zobowiązany zrobić review w ciągu 24 godzin.

|Reviewer  | Pon. | Wt. | Śr. | Czw. | Pt. | Sob. | Niedz.
|:--------:|:--:|:--:|:--:|:--:|:--:|---:|:--:|
| @kaplonpaulina|    |    |    |    |    |    |   
| @pectom       |    |    |    |    |    |    |   
| @maciekb05    |    |    |    |    |    |    |   
| @Qwebeck      |    |    |    |    |    |    |   
| @Sig00rd      |    |    |    |    |    |    |   

## Code conventions
### Pliki
Dajemy nazwy plikom w kebab-case'ie.
Typy plików:
- helper - zgrupowane są statyczne metody, niepasujące do logiki/modelu
- model - interfejsy, klasy abstrakcyjne, enumy, stałe  
- component - posiada swój lokalny stan. Jeśli stan lokalny wpływa na stan globalny to wywołuje funkcje z logiki, która zmienia 
- logic - funkcje które pracują ze stanem

### Funkcje
Nie definiujemy funkcji jako funkcji strzałkowe.
```javascript
// Bad
const foo = () => console.log('Foo');

// Good
function foo() {
    console.log('Foo');
}

// Also good
functionThatAcceptsCallbackAsParameter(()=> {
    console.log('Callback');
})
```
