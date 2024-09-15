import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-residential',
  templateUrl: './residential.component.html',
  styleUrls: ['./residential.component.scss']
})
export class ResidentialComponent {

  constructor(private router: Router){

  }

  scroll(elementID: string, dir: string) {
    const scrollAmount = 200;  // The amount to scroll (can be adjusted)
    
    // Get the scrollable element by its ID
    const element = document.getElementById(elementID);
    
    if (element) {
      // Get current scroll position
      const currentScroll = element.scrollLeft;
      
      // Get the total scrollable width (max scroll point)
      const maxScroll = element.scrollWidth - element.clientWidth;
      
      // Scroll based on direction
      if (dir === 'right') {
        // Scroll to the right
        const newScroll = Math.min(currentScroll + scrollAmount, maxScroll);  // Ensure it does not exceed maxScroll
        element.scrollTo({ left: newScroll, behavior: 'smooth' });
      } else if (dir === 'left') {
        // Scroll to the left
        const newScroll = Math.max(currentScroll - scrollAmount, 0);  // Ensure it does not go below 0
        element.scrollTo({ left: newScroll, behavior: 'smooth' });
      }
    }
  }


  navigate(type: string){
    this.router.navigate(['category/items-list'])
  }


}
