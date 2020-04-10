import { Component, OnInit, Input, Output } from '@angular/core';
import { GamesArenaService } from '../services/games-arena-service';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @Input() userSearch: string;
  @Input() sortBy: string;

  // MatPaginator Inputs
  displayLength: number = 100;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  pageStartIndex: number = 0;
  pageEndIndex: number = 10;  

  filteredGamesRawData = [];
  filteredGamesViewData = [];

  constructor(private gamesArenaService: GamesArenaService ) {}

  ngOnInit() {
    this.gamesArenaService.getGamesData()
      .subscribe(responseData => {
        this.filterGamesData(responseData);
        this.addToggleKeys();
      }, error => {
          this.filteredGamesViewData = [];
        alert('Currently unable to fetch the data.');
      });
  }

  /* Add show key to the filtered data to toggle the items in view */
  addToggleKeys() {
    this.filteredGamesViewData.forEach(game => {
      game.show = true;
    });
  }

  /* Filter games data */
  filterGamesData(responseData: any) {
    var filteredValidGamesData = responseData.filter(function (data) {
      return (data.hasOwnProperty('title') && data.hasOwnProperty('platform') && data.hasOwnProperty('score') && data.hasOwnProperty('genre') && data.hasOwnProperty('editors_choice'));
    });

    this.filteredGamesRawData = filteredValidGamesData;

    this.displayLength = filteredValidGamesData.length;

    // Clone filtered data.
    this.filteredGamesViewData = filteredValidGamesData.slice(0, this.pageSize);
  }

  public getSelectedPageData(event?: PageEvent) {
    this.pageStartIndex = event.pageIndex * event.pageSize;
    this.pageEndIndex = this.pageStartIndex + event.pageSize;

    this.updatePageDataByPageIndexs(this.pageStartIndex, this.pageEndIndex);
    this.addToggleKeys();
    this.sortGamesData();

    return event;
  }

  sortGamesData() {
    this.filteredGamesRawData.sort((a, b) => {
      if (this.sortBy == 'Ascending') {
        return (a.score - b.score);
      } else if (this.sortBy == 'Descending') {
        return (b.score - a.score);
      }
    });

    this.updatePageDataByPageIndexs(this.pageStartIndex, this.pageEndIndex);
  }

  updatePageDataByPageIndexs(pageStartIndex: number, pageEndIndex: number) {
    // Clone filtered data.
    var filteredGamesViewData = this.filteredGamesRawData.slice(pageStartIndex, pageEndIndex);
    this.filteredGamesViewData.splice(0);

    for (var gameData of filteredGamesViewData) {
      // Show filteted data by default.
      gameData.show = true;

      this.filteredGamesViewData.push(gameData);
    }
  }

  searchGame() {
    if (this.userSearch == '') {
      return;
    }

    this.filteredGamesViewData.forEach(game => {
      let title = (game.title).toLowerCase();
      if (title.indexOf(this.userSearch) != -1) {
        game['show'] = true;
      } else {
        game['show'] = false;
      }
    });
  }

  clearSearch() {
    this.userSearch = '';
    this.addToggleKeys();
  }
}
