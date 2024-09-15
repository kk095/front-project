import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { finalize } from 'rxjs';
import { DataSharedService } from '../Service/data-shared.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  action: string | null = null;
  tables: string[] = ['products','About us','contact us']; // List of tables
  category:string[]=['Industrial','Residential'];
  subcategory1:string[]=['Single Phase','Three Phase'];
  subcategory2:string[]=['Monoblock','Shallow Well'];
  type1:string[]=['Mini Master 0.5HP','Super Flow King 1.1HP','Super Flow King 1HP','Super Flow King 1.5HP'];
  type2:string[]=['Shallow Well 1HP','Shallow Well 1.5HP'];

  uploading = false; 
  selectedFile: File | null = null;

  // Reactive forms for adding a product and deleting an item
  deleteForm: FormGroup;
  newProductForm: FormGroup;

  // Form control for selecting a table
  selectedTableControl: FormControl;

  constructor(
    private fb: FormBuilder,
    private dataService: DataSharedService
  ) {
    // Initialize the delete form
    this.deleteForm = this.fb.group({
      itemIdToDelete: ['', Validators.required]
    });

    // Initialize the add product form
    this.newProductForm = this.fb.group({
      title: ['', Validators.required],
      desc: ['', Validators.required],
      category: ['', Validators.required],
      subcategory: ['', Validators.required],
      type: [''],
      imageUrl: [''] 
    });

    // Initialize the selected table form control
    this.selectedTableControl = new FormControl('', Validators.required);
  }

  // To set the current action (Add/Delete)
  setAction(action:any) {

    console.log(action.target.value);
    
    this.action = action.target.value;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  async onSubmitNewProduct() {
    if (this.newProductForm.valid) {
      let formData = this.newProductForm.value;
      formData = {...formData,file:this.selectedFile};
      let res =await this.dataService.UploadProduct(formData);
      if(res){
        this.newProductForm.reset();
        console.log("product uploaded successfully");
      }
        
      
    }
  }

 
  onDelete() {
    if (this.deleteForm.valid) {
      const itemIdToDelete = this.deleteForm.value.itemIdToDelete;
      console.log('Deleting item with ID:', itemIdToDelete);
      // Add logic to handle deleting the item from the database
    } else {
      console.log('Form is invalid');
    }
  }

  change(temp:string){
    if(temp=='cat'){
      this.newProductForm.patchValue({
        subcategory:"",
        type:""
      })
    }else if(temp=='sub'){
      this.newProductForm.patchValue({
        type:""
      })
    }
  }
}
