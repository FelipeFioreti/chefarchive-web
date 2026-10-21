import { Directive } from '@angular/core';

// Marca o template usado para o item selecionado e para cada opção do app-select.
@Directive({
  selector: 'ng-template[appSelectOption]'
})
export class SelectOptionDirective {}
