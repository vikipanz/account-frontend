import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CallApiService } from '../call-api.service';
import { map, startWith } from 'rxjs';
import { Lr } from '../lr.interface';

@Component({
  selector: 'app-page-two',
  templateUrl: './page-two.component.html',
  styleUrls: ['./page-two.component.scss']
})
export class PageTwoComponent implements OnInit {

  public formTwo!: FormGroup;
  public tableData : any;
  columns = ['lrNum','lrDate','party',  'vehicalNo',  'from',  'to',  'materialName',  'loadnetWt',  'unloadnetWt',  'rate', 'delete'];
  filteredSuggestions: any[] = [];
  selectedValuePresent = false;
  selectedSuggestion: any[] = [];

  constructor(private formBuilder: FormBuilder, private apiSrv: CallApiService) { }

  ngOnInit(): void {
    this.getFormTwoValues();
    this.formTwo = this.formBuilder.group({
      lrNum: new FormControl('',[Validators.required]),
      lrDate: new FormControl('',[Validators.required]),
      party: new FormControl('',[Validators.required]),
      vehicalNo: new FormControl('',[Validators.required]),
      from: new FormControl('',[Validators.required]),
      to: new FormControl('',[Validators.required]),
      materialName: new FormControl('',[Validators.required]),
      loadnetWt: new FormControl('',[Validators.required]),
      unloadnetWt: new FormControl('',[Validators.required]),
      rate: new FormControl('', Validators.required)
    });
    this.formTwo.get('lrNum')?.valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filterSuggestions(value))
    ).subscribe((val)=> this.filteredSuggestions = val);
  }

  private _filterSuggestions(value: string) {
    if(value){
      const filterValue = value.toLowerCase();
      return this.tableData.filter((resp:any) => resp.lrNum.toLowerCase().includes(filterValue));
    }
  }


  getFormTwoValues(){
    this.apiSrv.getFormOneData().subscribe((resp)=>this.tableData = resp)
  }

  postFormTwoData(){
    let formValue = this.formTwo.getRawValue();
    if(this.selectedValuePresent){
      this.apiSrv.putFormOneData(this.formTwo.get('lrNum')?.value, formValue).subscribe((resp)=>{
        this.apiSrv.getFormOneData().subscribe((resp)=>this.tableData = resp) 
      },
      error=>console.log(error)
    );
    this.formTwo.reset();
    }
    else{
      this.apiSrv.postFormOneData(formValue).subscribe(resp=>{
        this.apiSrv.getFormOneData().subscribe((resp)=>this.tableData = resp)
      },
      error=>console.log(error.message));
      this.formTwo.reset();
    }
  }

  onLrNumSelected(event: any) {
    const selectedLrNum = event.option.value;
    this.selectedSuggestion = this.tableData.filter((suggestion: any) => suggestion.lrNum === selectedLrNum);
    if (this.selectedSuggestion) {
      this.formTwo.patchValue({
        lrDate: this.selectedSuggestion[0]?.lrDate,
        party: this.selectedSuggestion[0]?.party,
        vehicalNo: this.selectedSuggestion[0]?.vehicalNo,
        from: this.selectedSuggestion[0]?.from,
        to: this.selectedSuggestion[0]?.to,
        materialName: this.selectedSuggestion[0]?.materialName,
        loadnetWt: this.selectedSuggestion[0]?.loadnetWt,
        unloadnetWt: this.selectedSuggestion[0]?.unloadnetWt,
        rate: this.selectedSuggestion[0]?.rate
      });
      this.selectedValuePresent = true;
    }
    else{
      this.selectedValuePresent = false;
    }
  }

  onLrInput(){
    const lrNum = this.formTwo.get('lrNum')?.value;
    this.formTwo.reset();
    this.selectedValuePresent = false;
    this.formTwo.patchValue({lrNum: lrNum});
  }

  deleteRow(record: any){
    this.apiSrv.deleteRecord(record.lrNum).subscribe();
  }

}
