import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CallApiService } from '../call-api.service';
import { map, startWith } from 'rxjs';

@Component({
  selector: 'app-page-four',
  templateUrl: './page-four.component.html',
  styleUrls: ['./page-four.component.scss']
})
export class PageFourComponent implements OnInit {

  public formFour!: FormGroup;
  columns = [
    'lrNum',
    'vehicalNo',
    'transportName',
    'advanceAmount',
    'advanceRemark',
    'dieselAmount',
    'rate',
    'shortage',
    'shortagePermissible',
    'detention',
    'delete'
  ]
  tableData: any;
  filteredSuggestions: any[] = [];
  selectedValuePresent = false;
  selectedSuggestion: any[] = [];

  constructor(private formBuilder: FormBuilder, private apiSrv: CallApiService) { }

  ngOnInit(): void {
    this.formFour = this.formBuilder.group({
      lrNum: new FormControl('',[Validators.required]),
      vehicalNo: new FormControl('',[Validators.required]),
      transportName: new FormControl('',[Validators.required]),
      advanceAmount: new FormControl('',[Validators.required]),
      advanceRemark: new FormControl('',[Validators.required]),
      dieselAmount: new FormControl('',[Validators.required]),
      rate: new FormControl('',[Validators.required]),
      shortage: new FormControl('',[Validators.required]),
      shortagePermissible: new FormControl('',[Validators.required]),
      detention: new FormControl('',[Validators.required])
    });
    this.apiSrv.getFormOneData().subscribe(resp=>this.tableData=resp);
    this.formFour.get('lrNum')?.valueChanges.pipe(
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

  getValue(){
    let formValue = this.formFour.getRawValue();
    this.apiSrv.postFormOneData(formValue).subscribe(resp=>{
      this.apiSrv.getFormOneData().subscribe(resp=>this.tableData=resp);
    },
    error=>console.log(error.message));
    this.formFour.reset();
  }


  onLrNumSelected(event: any) {
    const selectedLrNum = event.option.value;
    this.selectedSuggestion = this.tableData.filter((suggestion: any) => suggestion.lrNum === selectedLrNum);
    if (this.selectedSuggestion) {
      this.formFour.patchValue({
        vehicalNo: this.selectedSuggestion[0]?.vehicalNo,
        transportName: this.selectedSuggestion[0]?.transportName,
        advanceAmount: this.selectedSuggestion[0]?.advanceAmount,
        advanceRemark: this.selectedSuggestion[0]?.advanceRemark,
        dieselAmount: this.selectedSuggestion[0]?.dieselAmount,
        rate: this.selectedSuggestion[0]?.rate,
        shortage: this.selectedSuggestion[0]?.shortage,
        shortagePermissible: this.selectedSuggestion[0]?.shortagePermissible,
        detention: this.selectedSuggestion[0]?.detention
      });
      this.selectedValuePresent = true;
    }
    else{
      this.selectedValuePresent = false;
    }
  }

  onLrInput(){
    const lrNum = this.formFour.get('lrNum')?.value;
    this.formFour.reset();
    this.selectedValuePresent = false;
    this.formFour.patchValue({lrNum: lrNum});
  }


  deleteRow(record: any){
    this.apiSrv.deleteRecord(record.lrNum).subscribe(resp=>{
      this.apiSrv.getFormOneData().subscribe((resp)=>this.tableData = resp) 
    });
  }
}
