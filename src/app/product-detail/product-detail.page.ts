import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
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
  showDeleteProductSpinner: boolean = false;

  constructor(private helperService: HelperService,
              private activatedRoute: ActivatedRoute,
              private firestoreDbService: FirestoreDbService,
              private widgetUtilService: WidgetUtilService,
              private router: Router) {
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

  async updateProduct() {
    try {
      this.showEditProductSpinner = true;
      const updateProductDetails = {};
      for (const formField in this.editProductForm.controls) {
        const control = this.editProductForm.controls[formField];
        if (control.dirty) {
          console.log('editProductForm.controls', formField, control);
          updateProductDetails[formField] = control.value;
        }

        console.log('updateProductDetails', updateProductDetails)

      }
      const result = await this.firestoreDbService.updateData('product', this.productId, updateProductDetails);
      await this.getProductDetail();
      await this.openEditProductForm();
      this.widgetUtilService.presentToast('Product Updated Successfully!');
      this.showEditProductSpinner = false;
      this.showEditProductForm = false;
    } catch (error) {
      console.log('updateProduct error', error)
      this.widgetUtilService.presentToast(error.message);
      this.showEditProductSpinner = false;
    }
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

  deleteProduct() {
    this.widgetUtilService.presentAlertConfirm(
        'Delete Product',
        `Are you sure you want to delete ${this.productDetail.name}`,
        [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: (blah) => {
            }
          }, {
          text: 'Okay',
    handler: async () => {
            try {
              this.showDeleteProductSpinner = true;
              await this.firestoreDbService.deleteData('product', this.productId);
              this.widgetUtilService.presentToast('Product deleted successfully!');
              this.showDeleteProductSpinner = false;
              this.router.navigate(['/home']);
            } catch (error) {
              this.widgetUtilService.presentToast(error.message);
              this.showDeleteProductSpinner = false;
            }
    }
        }
        ]
    );

  }

}
