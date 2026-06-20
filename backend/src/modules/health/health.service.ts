// Health Nodes 数据服务 — 全球节点健康监测

import { Injectable } from '@nestjs/common';

type StatusType = 'healthy' | 'warning' | 'critical';

interface NodeHealth {
  id: string;
  flag: string;
  name: string;
  city: string;
  latency: number;
  jitter: number;
  packetLoss: number;
  iosStatus: StatusType;
  androidStatus: StatusType;
  iosDesc: string;
  androidDesc: string;
}

interface SLASummary {
  healthyRatio: number;
  warningRatio: number;
  criticalRatio: number;
}

export interface HealthNodesData {
  nodes: NodeHealth[];
  sla: SLASummary;
}

interface NodeBase {
  id: string;
  flag: string;
  name: string;
  city: string;
  baseLatency: number;
  baseJitter: number;
  basePacketLoss: number;
  iosStatus: StatusType;
  androidStatus: StatusType;
  iosDesc: string;
  androidDesc: string;
}

const NODES_BASE: NodeBase[] = [
  {
    id: 'us-east',
    flag: '🇺🇸',
    name: 'US East',
    city: 'Virginia',
    baseLatency: 12,
    baseJitter: 2,
    basePacketLoss: 0.01,
    iosStatus: 'healthy',
    androidStatus: 'healthy',
    iosDesc: 'Normal operation',
    androidDesc: 'Normal operation',
  },
  {
    id: 'us-west',
    flag: '🇺🇸',
    name: 'US West',
    city: 'San Jose',
    baseLatency: 18,
    baseJitter: 3,
    basePacketLoss: 0.02,
    iosStatus: 'healthy',
    androidStatus: 'healthy',
    iosDesc: 'Normal operation',
    androidDesc: 'Normal operation',
  },
  {
    id: 'eu-west',
    flag: '🇬🇧',
    name: 'EU West',
    city: 'London',
    baseLatency: 25,
    baseJitter: 4,
    basePacketLoss: 0.05,
    iosStatus: 'healthy',
    androidStatus: 'warning',
    iosDesc: 'Normal operation',
    androidDesc: 'Occasional latency spikes',
  },
  {
    id: 'eu-central',
    flag: '🇩🇪',
    name: 'EU Central',
    city: 'Frankfurt',
    baseLatency: 22,
    baseJitter: 3,
    basePacketLoss: 0.03,
    iosStatus: 'healthy',
    androidStatus: 'healthy',
    iosDesc: 'Normal operation',
    androidDesc: 'Normal operation',
  },
  {
    id: 'ap-east',
    flag: '🇸🇬',
    name: 'AP East',
    city: 'Singapore',
    baseLatency: 35,
    baseJitter: 8,
    basePacketLoss: 0.12,
    iosStatus: 'warning',
    androidStatus: 'warning',
    iosDesc: 'Elevated latency detected',
    androidDesc: 'Intermittent connectivity issues',
  },
  {
    id: 'ap-south',
    flag: '🇮🇳',
    name: 'AP South',
    city: 'Mumbai',
    baseLatency: 42,
    baseJitter: 12,
    basePacketLoss: 0.18,
    iosStatus: 'warning',
    androidStatus: 'critical',
    iosDesc: 'Degraded performance',
    androidDesc: 'Service disruption reported',
  },
  {
    id: 'me-east',
    flag: '🇦🇪',
    name: 'ME East',
    city: 'Dubai',
    baseLatency: 38,
    baseJitter: 6,
    basePacketLoss: 0.08,
    iosStatus: 'healthy',
    androidStatus: 'warning',
    iosDesc: 'Normal operation',
    androidDesc: 'Slight performance degradation',
  },
  {
    id: 'af-south',
    flag: '🇿🇦',
    name: 'AF South',
    city: 'Johannesburg',
    baseLatency: 65,
    baseJitter: 18,
    basePacketLoss: 0.25,
    iosStatus: 'critical',
    androidStatus: 'critical',
    iosDesc: 'Major connectivity issues',
    androidDesc: 'Service unavailable in some areas',
  },
  {
    id: 'sa-east',
    flag: '🇧🇷',
    name: 'SA East',
    city: 'Sao Paulo',
    baseLatency: 55,
    baseJitter: 15,
    basePacketLoss: 0.2,
    iosStatus: 'warning',
    androidStatus: 'warning',
    iosDesc: 'High latency in peak hours',
    androidDesc: 'Performance degradation',
  },
  {
    id: 'oc-southeast',
    flag: '🇦🇺',
    name: 'OC Southeast',
    city: 'Sydney',
    baseLatency: 28,
    baseJitter: 5,
    basePacketLoss: 0.04,
    iosStatus: 'healthy',
    androidStatus: 'healthy',
    iosDesc: 'Normal operation',
    androidDesc: 'Normal operation',
  },
];

@Injectable()
export class HealthService {
  getHealthNodesData(): HealthNodesData {
    // 健康监测不缓存，也不使用 getMultiplier 缩放（实时数据）
    const nodes: NodeHealth[] = NODES_BASE.map((n) => ({
      id: n.id,
      flag: n.flag,
      name: n.name,
      city: n.city,
      latency: n.baseLatency,
      jitter: n.baseJitter,
      packetLoss: n.basePacketLoss,
      iosStatus: n.iosStatus,
      androidStatus: n.androidStatus,
      iosDesc: n.iosDesc,
      androidDesc: n.androidDesc,
    }));

    const statusCounts = { healthy: 0, warning: 0, critical: 0 };
    for (const node of nodes) {
      // 取两个平台中较差的状态来计入 SLA
      const worst: StatusType =
        node.iosStatus === 'critical' || node.androidStatus === 'critical'
          ? 'critical'
          : node.iosStatus === 'warning' || node.androidStatus === 'warning'
            ? 'warning'
            : 'healthy';
      statusCounts[worst]++;
    }

    const total = nodes.length;
    const sla: SLASummary = {
      healthyRatio: parseFloat((statusCounts.healthy / total).toFixed(2)),
      warningRatio: parseFloat((statusCounts.warning / total).toFixed(2)),
      criticalRatio: parseFloat((statusCounts.critical / total).toFixed(2)),
    };

    return { nodes, sla };
  }
}
