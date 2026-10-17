const { Op } = require("sequelize");
const { Visitor, Member } = require("../models");

// Small helper: returns a Date object for "N days ago" at midnight,
// so date range queries are clean day boundaries rather than exact timestamps.
function daysAgo(n) {
  const date = new Date();
  date.setDate(date.getDate() - n);
  date.setHours(0, 0, 0, 0);
  return date;
}

// GET /dashboard/stats
// Returns overview numbers for the pastor's dashboard.
async function getStats(req, res, next) {
  try {
    const churchId = req.churchId;

    const startOfWeek = daysAgo(7);
    const startOfMonth = daysAgo(30);

    const [visitorsThisWeek, visitorsThisMonth, totalVisitors, convertedVisitors, totalMembers] =
      await Promise.all([
        Visitor.count({ where: { churchId, createdAt: { [Op.gte]: startOfWeek } } }),
        Visitor.count({ where: { churchId, createdAt: { [Op.gte]: startOfMonth } } }),
        Visitor.count({ where: { churchId } }),
        Visitor.count({ where: { churchId, converted: true } }),
        Member.count({ where: { churchId } }),
      ]);

    // Conversion rate: what percentage of all-time visitors became members.
    // Guard against division by zero when there are no visitors yet.
    const conversionRate =
      totalVisitors === 0 ? 0 : Math.round((convertedVisitors / totalVisitors) * 100);

    // 7-day growth: count of new visitors for each of the last 7 days,
    // useful for a small bar/line chart on the dashboard.
    const growthPromises = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = daysAgo(i);
      const dayEnd = daysAgo(i - 1);
      growthPromises.push(
        Visitor.count({
          where: { churchId, createdAt: { [Op.gte]: dayStart, [Op.lt]: dayEnd } },
        }).then((count) => ({ date: dayStart.toISOString().slice(0, 10), count }))
      );
    }
    const last7DaysGrowth = await Promise.all(growthPromises);

    res.json({
      visitorsThisWeek,
      visitorsThisMonth,
      totalMembers,
      conversionRate,
      last7DaysGrowth,
    });
  } catch (err) {
    next(err);
  }
}

// GET /dashboard/alerts
// Returns visitors who came in but haven't been converted or followed up on yet.
async function getAlerts(req, res, next) {
  try {
    const churchId = req.churchId;

    const pendingVisitors = await Visitor.findAll({
      where: { churchId, converted: false, wantsToStay: true },
      order: [["createdAt", "DESC"]],
      limit: 10,
    });

    res.json({ pendingFollowUps: pendingVisitors });
  } catch (err) {
    next(err);
  }
}

module.exports = { getStats, getAlerts };