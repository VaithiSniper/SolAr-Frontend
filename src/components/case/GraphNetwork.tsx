import React, { useMemo } from 'react';
import { DefaultNode, Graph } from '@visx/network';
import { Member } from './MemberView';

export type NetworkProps = {
  width: number;
  height: number;
};

export interface CustomNode {
  x: number;
  y: number;
  color?: string;
}

export interface CustomLink {
  source: CustomNode;
  target: CustomNode;
  dashed?: boolean;
}

const nodes: CustomNode[] = [
  { x: 50, y: 20 },
  { x: 200, y: 250 },
  { x: 300, y: 40, color: '#26deb0' },
];

const links: CustomLink[] = [
  { source: nodes[0], target: nodes[1] },
  { source: nodes[1], target: nodes[2] },
  { source: nodes[2], target: nodes[0], dashed: true },
];

export interface Graph {
  nodes: CustomNode[],
  links: CustomLink[]
}

const graph: Graph = {
  nodes,
  links,
};

export const background = '#272b4d';

export default function GraphNetwork({ width, height, members }: { width: number, height: number, members: Member[] }) {

  const GRAPH_VIEW_WIDTH: number = 460;
  const GRAPH_VIEW_HEIGHT: number = 400;
  const GRAPH_INTER_NODE_OFFSET: number = 30;

  const graph: Graph = useMemo(() => {
    const nodesList: CustomNode[] = members.map((member, index) => (
      member.role === "Judge" ?
        {
          x: GRAPH_VIEW_WIDTH / 2, y: 10, color: '#26deb0'
        }
        :
        (
          member.group === "Prosecutor" ?
            {
              x: (GRAPH_VIEW_WIDTH / 2) - GRAPH_INTER_NODE_OFFSET * index, y: 30 + GRAPH_INTER_NODE_OFFSET * index, color: "orange"
            }
            :
            {
              x: (GRAPH_VIEW_WIDTH / 2) + GRAPH_INTER_NODE_OFFSET * index, y: 30 + GRAPH_INTER_NODE_OFFSET * index, color: "lavender"
            }
        )
    ))
    console.log("trunc array ->", nodesList.slice(1))
    const linksToJudge: CustomLink[] = nodesList.slice(1).map((_, index) => (
      {
        source: nodesList[index + 1], target: nodesList[0]
      }
    ))
    // const prosecutorSideLawyers: Member[] = members.slice(1).filter((member) => (
    //   member.group === "Prosecutor" && member.role === "Lawyer"
    // ))
    // const prosecutorSideClients: Member[] = members.slice(1).filter((member) => (
    //   member.group === "Prosecutor" && member.role === "Client"
    // ))
    // const defendantSideLawyers: Member[] = members.slice(1).filter((member) => (
    //   member.group === "Defendant" && member.role === "Lawyer"
    // ))
    // const defendantSideClients: Member[] = members.slice(1).filter((member) => (
    //   member.group === "Defendant" && member.role === "Client"
    // ))
    // const linksAcrossToLawyerAndClientProsecutor: CustomLink[] = prosecutorSideClients.map((prosecutor) => ({
    //   source: nodes[]
    // }))
    return { nodes: nodesList, links: linksToJudge }
  }, [members])

  console.log("graph ->", graph.nodes)

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <rect width={width} height={height} rx={14} fill={background} />
      <Graph<CustomLink, CustomNode>
        graph={graph}
        top={50}
        left={0}
        nodeComponent={({ node: { color } }) =>
          color ? <DefaultNode fill={color} /> : <DefaultNode />
        }
        linkComponent={({ link: { source, target, dashed } }) => (
          <line
            x1={source.x}
            y1={source.y}
            x2={target.x}
            y2={target.y}
            strokeWidth={2}
            stroke="#999"
            strokeOpacity={0.6}
            strokeDasharray={dashed ? '8,4' : undefined}
          />
        )}
      />
    </svg>
  );
}
