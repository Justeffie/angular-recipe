import {Directive, ElementRef, HostBinding, HostListener, OnInit, Renderer2} from "@angular/core";
@Directive({
  selector: '[appDrowpdown]'
})
export class DropdownDirective implements OnInit {
  @HostBinding('class.open') isOpen = false;

  constructor(private elemRef: ElementRef, private rendererElem: Renderer2) {}

  ngOnInit() {
  }

  // @HostListener('click') toggle() {
  //   this.isOpen = !this.isOpen;
  // }

  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    this.isOpen = this.elemRef.nativeElement.contains(event.target) ? !this.isOpen : false;
  }
  // @HostListener('click') onclick() {
  //   if (this.elemRef.nativeElement.classList.contains('open')) {
  //     this.rendererElem.removeClass(this.elemRef.nativeElement, 'open');
  //   } else {
  //     this.rendererElem.addClass(this.elemRef.nativeElement, 'open');
  //   }
  // }
}
