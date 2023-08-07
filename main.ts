import { Plugin, WorkspaceLeaf, App, ItemView, View, Notice } from 'obsidian';
import * as d3 from 'd3';

export default class MyLifeInWeeksPlugin extends Plugin {
    sidebar: LifeInWeeksView | null = null;

    async onload() {
        this.registerView('life-in-weeks-view', (leaf: WorkspaceLeaf) => {
            if (this.sidebar) return this.sidebar;
            return this.sidebar = new LifeInWeeksView(leaf);
        });

        const statusBarItem = this.addStatusBarItem();
        statusBarItem.setText('Life in Weeks');
        statusBarItem.onClickEvent(() => {
            if (this.sidebar) {
                this.sidebar.leaf.detach();
                this.sidebar = null;
            } else {
                this.sidebar = new LifeInWeeksView(this.app.workspace.splitActiveLeaf());
            }
        });
    }

    onunload() {
        if (this.sidebar) {
            this.sidebar.leaf.detach();
        }
    }
}

class LifeInWeeksView extends ItemView {
    constructor(leaf: WorkspaceLeaf) {
        super(leaf);

        const container = this.containerEl;
        container.empty();

        const width = 400;
        const height = 1800;
        const cellSize = 7;

        const svg = d3.create('svg')
            .attr('viewBox', [0, 0, width, height]);

        const svgNode = svg.node();
        if (svgNode) container.appendChild(svgNode);

        const weeks = d3.range(0, 4680).map((d: number) => {
            return {
                weekNumber: d,
                year: Math.floor(d / 52),
                color: d < 1300 ? 'steelblue' : 'lightgray'
            };
        });

        svg.selectAll('rect')
            .data(weeks)
            .join('rect')
            .attr('width', cellSize)
            .attr('height', cellSize)
            .attr('x', (d: any, i: number) => (i % 52) * cellSize)
            .attr('y', (d: any, i: number) => Math.floor(i / 52) * cellSize)
            .attr('fill', (d: any) => d.color)
            .on('mouseover', function(event: any, d: any) {
                d3.select(this).attr('fill', 'red');
            })
            .on('mouseout', function(event: any, d: any) {
                d3.select(this).attr('fill', d.color);
            });
    };

    getDisplayText(): string {
        return "My Life in Weeks";
    }

    getViewType(): string {
        return "life-in-weeks-view";
    }
}
