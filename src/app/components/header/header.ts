import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, MatButton],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header { }
