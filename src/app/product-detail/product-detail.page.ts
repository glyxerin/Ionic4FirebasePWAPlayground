import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FirestoreDbService} from "../providers/firestore-db.service";
import {WidgetUtilService} from "../providers/widget-util.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {EDITPRODUCT} from "../constants/formValidationMessage";
import {HelperService} from "../providers/helper.service";

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.page.html',
    styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {

  productId: string = '';
  productDetailAvailable: boolean = false;
  productDetail: any = {};
  productDetailList: Array<any> = [];
  showEditProductForm: boolean = false;

  editProductForm: FormGroup;
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
  validationMessage: any = EDITPRODUCT;
  showEditProductSpinner: boolean = false;

  constructor(private helperService: HelperService,
              private activatedRoute: ActivatedRoute,
              private firestoreDbService: FirestoreDbService,
              private widgetUtilService: WidgetUtilService) {
    this.activatedRoute.params.subscribe((result) => {
      console.log('result activatedRoute', result);
      this.productId = result.id;
      this.getProductDetail();
    })
  }

  ngOnInit() {
    this.createFormControl();
    this.createForm();
  }

  resetForm() {
    this.editProductForm.reset();
    this.formError = {
      name: '',
      price: '',
      brand: '',
      size: ''
    };
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
    this.editProductForm = new FormGroup({
      name: this.name,
      price: this.price,
      brand: this.brand,
      size: this.size
    });

    this.editProductForm.valueChanges.subscribe(data => {
      this.onFormValueChanged(data);
    })
  }

  onFormValueChanged(data) {
    // console.log('data', data);
    // console.log('this.loginForm', this.loginForm);

    this.formError = this.helperService.prepareValidationMessage(this.editProductForm, this.validationMessage, this.formError);

    console.log('=====formError', this.formError);
  }

  async getProductDetail() {
    try {
      this.productDetailAvailable = false;
      const result = await this.firestoreDbService.getDataById('product', this.productId);
      this.productDetail = result;
      console.log('product detail', result);
      this.productDetailList = [];
      for (const key in this.productDetail) {
        this.productDetailList.push({
          name: key,
          value: this.productDetail[key]
        })
      }
      this.productDetailAvailable = true;
    } catch (error) {
      console.log('getProductDetail error', error)

      this.widgetUtilService.presentToast(error.message);
      this.productDetailAvailable = true;
    }
  }

  openEditProductForm() {
    this.resetForm();
    this.showEditProductForm = true;
    for (const key in this.editProductForm.controls) {
      console.log('***', key)
      this.editProductForm.controls[key].setValue(this.productDetail[key]);
    }

  }

  cancelEdit() {
    this.showEditProductForm = false;

  }

}
