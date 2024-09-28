import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataSharedService } from '../Service/data-shared.service';
import { User } from '../Service/interfaces/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  action: string | null = null;  
  selectedFile: File | null = null;
  posterForm: FormGroup;
  userList: User[] = [];
  altText:string="";


  tables: string[] = ['products','About us','contact us','User','Poster']; // List of tables
  category:string[]=['Industrial','Residential'];
  subcategory1:string[]=['Single Phase','Three Phase'];
  subcategory2:string[]=['Monoblock','Shallow Well'];
  type1:string[]=['Mini Master 0.5HP','Super Flow King 1.1HP','Super Flow King 1HP','Super Flow King 1.5HP'];
  type2:string[]=['Shallow Well 1HP','Shallow Well 1.5HP'];
  roles:string[]=['customer','admin']

  deleteForm: FormGroup;
  newProductForm: FormGroup;
  additionalFields: any[] = [];
  roleUpdateForm: FormGroup;
  contactForm: FormGroup;
  AboutForm: FormGroup;
  selectedTableControl: FormControl;




  constructor(
    private fb: FormBuilder,
    public dataService: DataSharedService,
    private router : Router
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
      imageUrl: [''] ,
      additionalDetails: this.fb.group({
        price: [''],
        // Custom fields are added dynamically
      }),
    });

    this.roleUpdateForm = this.fb.group({
      selectedUser: [''],
      newRole: ['']
    });
    this.contactForm = this.fb.group({
      email: [''],
      phone: [''],
      address:['']
    });
    this.AboutForm = this.fb.group({
      p1: [''],
      p2: [''],
    });

    // Initialize the selected table form control
    this.selectedTableControl = new FormControl('', Validators.required);
  }

  // To set the current action (Add/Delete)
  setAction(action:any) {
    this.action = action.target.value;
    this.selectedTableControl.setValue(null);
  }

  async tableChange(){
    if(this.action=='delete'&&this.selectedTableControl.value=="Poster"){
      await this.dataService.fetchPosters();
    }else if(this.action=='add'&&this.selectedTableControl.value=="contact us"){
      await this.dataService.getContactData();
      this.contactForm.patchValue({
        phone:this.dataService.contactData.phone,
        email:this.dataService.contactData.email,
        address:this.dataService.contactData.address
      })
    }else if(this.action=="add"&&this.selectedTableControl.value=="About us"){
      await this.dataService.getAboutUs();
      this.AboutForm.patchValue({
        p1:this.dataService.aboutData.p1,
        p2:this.dataService.aboutData.p2,
      })
    }
  }

  onFileSelected(event: Event) {
    this.selectedFile =null;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  removeCustomField(index: number) {
    const customFields = this.newProductForm.get('additionalDetails') as FormGroup;
    customFields.removeControl('field' + index + '_name');
    customFields.removeControl('field' + index + '_value');

    this.additionalFields.splice(index, 1);
  }

  addCustomField() {
    const customFields = this.newProductForm.get('additionalDetails') as FormGroup;
    const index = this.additionalFields.length;
    customFields.addControl('field' + index + '_name', new FormControl(''));
    customFields.addControl('field' + index + '_value', new FormControl(''));

    this.additionalFields.push({ name: '', value: '' });
  }

  async onSubmitNewProduct() {
    
    if (this.newProductForm.valid) {
      let formData = this.newProductForm.value;
      formData = {...formData,file:this.selectedFile};
      let res =await this.dataService.UploadProduct(formData);
      if(res){
        this.newProductForm.reset();
      }
    }
  }

 
  onDelete() {
    if (this.deleteForm.valid) {
      const itemIdToDelete = this.deleteForm.value.itemIdToDelete;
      this.dataService.deleteProduct(itemIdToDelete);
    } else {
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

  onSubmitUser() {
    const selectedUserId = this.roleUpdateForm.get('selectedUser')?.value;
    const newRole = this.roleUpdateForm.get('newRole')?.value;
    this.dataService.updateUserRole(selectedUserId, newRole);
  }

  async openuserlist(){
   await this.dataService.fetchUsers();
   this.userList = this.dataService.userList;
  }

  onSubmitPoster(event){
    if(this.selectedFile){
      event.preventDefault();
      
      this.dataService.uploadPoster(this.selectedFile,this.altText);
    }
  }

  onDeletePoster(data){
    this.dataService.DeletePoster(data);
  }

  onSubmitContact(){
    this.dataService.UpdateContact(this.contactForm.value);
  }
  onSubmitAbout(){
    this.dataService.UpdateAbout(this.AboutForm.value);
  }

  public viewMessage(){
    this.router.navigate(['/message']);
  }
}
