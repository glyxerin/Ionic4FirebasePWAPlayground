import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ADDPRODUCT} from "../constants/formValidationMessage";
import {HelperService} from "../providers/helper.service";

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {
  addProductForm: FormGroup;
  name: FormControl;
  price: FormControl;
  brand: FormControl;
  size: FormControl;
  formError: any = {
    name: '',
    price: '',
    brand: '',
    size: ''
  };
  validationMessage: any = ADDPRODUCT;
  showAddProductSpinner: boolean = false;

  constructor(private helperService: HelperService) { }

  ngOnInit() {
    this.createFormControl();
    this.createForm();
  }

  createFormControl() {
    this.name = new FormControl('',
        [
          Validators.required
        ]
    );

    this.price = new FormControl('',
        [
          Validators.required
        ]
    );

    this.brand = new FormControl('',
        [
          Validators.required
        ]
    );

    this.size = new FormControl('',
        [
          Validators.required
        ]
    );
  }

  createForm() {
    this.addProductForm = new FormGroup({
      name: this.name,
      price: this.price,
      brand: this.brand,
      size: this.size
    });

    this.addProductForm.valueChanges.subscribe(data => {
      this.onFormValueChanged(data);
    })
  }

  onFormValueChanged(data) {
    // console.log('data', data);
    // console.log('this.loginForm', this.loginForm);

    this.formError = this.helperService.prepareValidationMessage(this.addProductForm, this.validationMessage, this.formError);

    console.log('=====formError', this.formError);
  }

  addProduct() {}

}
