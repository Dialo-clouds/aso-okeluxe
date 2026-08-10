import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../../lib/prisma';
import { getSessionFromCookies } from '../../../../lib/auth';

export async function GET() {
  const cookieStore = cookies();
  const session = getSessionFromCookies(cookieStore);
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  try {
    const [totalOrders, paidOrders, pendingOrders, totalProducts, totalVendors, totalUsers] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PAID' } }),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.product.count(),
      prisma.vendor.count(),
      prisma.user.count(),
    ]);

    const paidOrdersList = await prisma.order.findMany({
      where: { status: 'PAID' },
      select: { totalKobo: true },
    });
    const totalRevenueKobo = paidOrdersList.reduce((sum, o) => sum + o.totalKobo, 0);

    // Revenue by day for the last 14 days
    const since = new Date();
    since.setDate(since.getDate() - 13);
    since.setHours(0, 0, 0, 0);

    const recentOrders = await prisma.order.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true, totalKobo: true, status: true },
    });

    const dayBuckets = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      dayBuckets[key] = 0;
    }
    recentOrders.forEach((o) => {
      const key = o.createdAt.toISOString().slice(0, 10);
      if (dayBuckets[key] !== undefined && o.status === 'PAID') {
        dayBuckets[key] += o.totalKobo;
      }
    });
    const revenueByDay = Object.entries(dayBuckets).map(([date, kobo]) => ({
      date: date.slice(5), // MM-DD, cleaner for a small chart
      revenue: Math.round(kobo / 100),
    }));

    // Top 5 products by units sold
    const orderItemGroups = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });
    const topProductIds = orderItemGroups.map((g) => g.productId);
    const topProductRecords = await prisma.product.findMany({ where: { id: { in: topProductIds } } });
    const topProducts = orderItemGroups.map((g) => {
      const p = topProductRecords.find((pr) => pr.id === g.productId);
      return { name: p?.name || 'Unknown product', unitsSold: g._sum.quantity || 0 };
    });

    const recentOrdersList = await prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });

    return NextResponse.json({
      totalOrders,
      paidOrders,
      pendingOrders,
      totalProducts,
      totalVendors,
      totalUsers,
      totalRevenueKobo,
      revenueByDay,
      topProducts,
      recentOrders: recentOrdersList.map((o) => ({
        id: o.id,
        status: o.status,
        totalKobo: o.totalKobo,
        createdAt: o.createdAt,
        customerName: o.user?.name || 'Unknown',
      })),
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    return NextResponse.json({ error: 'Something went wrong loading stats.' }, { status: 500 });
  }
}
