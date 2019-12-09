import { Component, OnInit } from '@angular/core';
import { NavService } from '../../../services/nav.services'

@Component({
  selector: 'app-fixed-rate',
  templateUrl: './fixed-rate.component.html',
  styleUrls: ['./fixed-rate.component.scss']
})
export class FixedRateComponent implements OnInit {

    constructor(public navService: NavService) { }

  ngOnInit() {
  }

}
