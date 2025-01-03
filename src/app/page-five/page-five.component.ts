import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CallApiService } from '../call-api.service';
import { map, startWith } from 'rxjs';

@Component({
  selector: 'app-page-five',
  templateUrl: './page-five.component.html',
  styleUrls: ['./page-five.component.scss']
})
export class PageFiveComponent implements OnInit {
  public formFive!: FormGroup;
  columns = [
    'lrNum',
    'lrDate',
    'vehicalNo',
    'dieselAmount',
    'dieselQty',
    'tripAdvance',
    'tripRemark',
    'da',
    'daRemark',
    'cleaning',
    'cleaningRemark',
    'fastTag',
    'reportDate',
    'unloadDate',
    'km',
    'eta',
    'delay',
    'delete'
  ]
  tableData: any;
  filteredSuggestions: any[] = [];
  selectedValuePresent = false;
  selectedSuggestion: any[] = [];


  constructor(private formBuilder: FormBuilder, private apiSrv: CallApiService) { }

  ngOnInit(): void {
    this.formFive = this.formBuilder.group({
      lrNum: new FormControl('',[Validators.required]),
      lrDate: new FormControl('',[Validators.required]),
      vehicalNo: new FormControl('',[Validators.required]),
      dieselAmount: new FormControl('',[Validators.required]),
      dieselQty: new FormControl('',[Validators.required]),
      tripAdvance:  new FormControl('',[Validators.required]),
      tripRemark:  new FormControl('',[Validators.required]),
      da: new FormControl('',[Validators.required]),
      daRemark: new FormControl('',[Validators.required]),
      cleaning: new FormControl('',[Validators.required]),
      cleaningRemark: new FormControl('',[Validators.required]),
      fastTag: new FormControl('',[Validators.required]),
      reportDate: new FormControl('',[Validators.required]),
      unloadDate: new FormControl('',[Validators.required]),
      km: new FormControl('',[Validators.required]) ,
      eta: new FormControl('',[Validators.required]) ,
      delay: new FormControl('',[Validators.required])
    });

    
    this.apiSrv.getFormOneData().subscribe(resp=>this.tableData = resp);
    this.formFive.get('lrNum')?.valueChanges.pipe(
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
    if(this.selectedValuePresent){
      this.apiSrv.putFormOneData(this.formFive.get('lrNum')?.value, this.formFive.getRawValue()).subscribe((resp)=>{
        this.apiSrv.getFormOneData().subscribe((resp)=>this.tableData = resp) 
      },
    (error)=>{
      this.apiSrv.show(error.error.error);
    } 
    );
    this.formFive.reset();
    this.selectedSuggestion=[];
    }
    else{
      this.apiSrv.postFormOneData(this.formFive.getRawValue()).subscribe(resp=>{
        this.apiSrv.getFormOneData().subscribe((resp)=>this.tableData = resp)
      },
      (error)=>{
        console.log(error);
        this.apiSrv.show(error.error.error);
      });
      this.formFive.reset();
      this.selectedSuggestion=[];
    }
  }

  onLrNumSelected(event: any) {
    const selectedLrNum = event.option.value;
    this.selectedSuggestion = this.tableData.filter((suggestion: any) => suggestion.lrNum === selectedLrNum);
    if (this.selectedSuggestion) {
      this.formFive.patchValue({
        lrDate: this.selectedSuggestion[0]?.lrDate,
        vehicalNo: this.selectedSuggestion[0]?.vehicalNo,
        dieselAmount: this.selectedSuggestion[0]?.dieselAmount,
        dieselQty: this.selectedSuggestion[0]?.dieselQty,
        tripAdvance:  this.selectedSuggestion[0]?.tripAdvance,
        tripRemark:  this.selectedSuggestion[0]?.tripRemark,
        da: this.selectedSuggestion[0]?.da,
        daRemark: this.selectedSuggestion[0]?.daRemark,
        cleaning: this.selectedSuggestion[0]?.cleaning,
        cleaningRemark: this.selectedSuggestion[0]?.cleaningRemark,
        fastTag: this.selectedSuggestion[0]?.fastTag,
        reportDate: this.selectedSuggestion[0]?.reportDate,
        unloadDate: this.selectedSuggestion[0]?.unloadDate,
        km: this.selectedSuggestion[0]?.km,
        eta: this.selectedSuggestion[0]?.eta,
        delay: this.selectedSuggestion[0]?.delay
      });
      this.selectedValuePresent = true;
    }
    else{
      this.selectedValuePresent = false;
    }
  }

  onLrInput(){
    const lrNum = this.formFive.get('lrNum')?.value;
    this.formFive.reset();
    this.selectedValuePresent = false;
    this.formFive.patchValue({lrNum: lrNum});
  }


  deleteRow(record: any){
    this.apiSrv.deleteRecord(record.lrNum).subscribe(resp=>{
      this.apiSrv.getFormOneData().subscribe((resp)=>this.tableData = resp) 
    });
  }
}
