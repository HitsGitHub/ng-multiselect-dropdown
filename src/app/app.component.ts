import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { JsonServiceService } from 'src/app/json-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  myForm: FormGroup;
  submitted = false;
  selectedState = [];
  selectedCountry =[];
  filteredStates =[];
  filteredCity = [];
  storeCities = [];
  countries = [];
  cities = [];
  saveCity =[];
  limitSelection = false;
  dropdownSettings: any = {};
  dropdownSettings1: any = {};
  closeDropdownSelection = false;
  constructor(private formBuilder: FormBuilder,
    private JSon: JsonServiceService, private http: HttpClient) {
    this.JSon.getJsonData().subscribe(data => {
      this.countries = data;
      this.dropdownSettings1 = {
        singleSelection: true,
        idField: 'countryName',
        textField: 'countryName',
        closeDropDownOnSelection: true
      };
      for (let country of this.countries) {
        this.cities.push(country.cities);
      }
    })
  }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      country :new FormControl,
      state: new FormControl,
      chkbox: new FormArray([]),
    })
    
  }
  onSelectCountry(cuntry) {
    this.selectedCountry = cuntry ;    
    this.filteredStates = this.countries.find(con => con.countryName == cuntry).cities;
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      enableCheckAll: false,
    };
  }
  deselectCountry(deselectCountry) {
    this.filteredStates = [];
    this.filteredCity = [];
    this.myForm.reset();
  }
  onStateSelect(state) {
    this.selectedState.push(state.name);
    for (var j = 0; j <= this.selectedState.length; j++) {
      this.filteredCity = this.filteredStates.find(con => con.name[j] === state.name[j]).values;j
      this.storeCities.push(this.filteredCity[j].name);      
    }
  }
  onStateDeSelect(deSelectState) {
    console.log(deSelectState);
    this.filteredCity.splice(0);
  }
  onSubmit() {
    this.submitted = true;

   this.filteredCity.map((o, i) => {
      const control = new FormControl(i === 0);  // if first item set to true, else false
      (this.myForm.controls.chkbox as FormArray).push(control);
    });
    const selectedOrderIds = this.myForm.value.chkbox.map((v, i) =>
     v ? this.storeCities[i].name : this.storeCities[i].name).filter(v => v !== null);
    (this.myForm.controls.chkbox as FormArray).setValue(selectedOrderIds);

    localStorage.setItem('Form_Data', JSON.stringify(this.myForm.value));
    this.myForm.reset();
  }
 toggleCloseDropdownSelection() {
    this.closeDropdownSelection = !this.closeDropdownSelection;
    this.dropdownSettings1 = Object.assign({}, this.dropdownSettings1, { closeDropDownOnSelection: this.closeDropdownSelection });
  }
  handleLimitSelection() {
    if (this.limitSelection) {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: 2 });
    } else {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: null });
    }
  }
  saveItem(val,i){ 
    console.log(val);
    
    if(localStorage.getItem('saveCity')){
       this.saveCity = JSON.parse(localStorage.getItem('saveCity'));
       this.saveCity.push(val);
       localStorage.setItem('saveCity',JSON.stringify(this.saveCity));
     }else{
       this.saveCity.push(val);
       localStorage.setItem('saveCity',JSON.stringify(this.saveCity));
 
      } 
    }
}
