import { QueryTypes, DataTypes, Sequelize } from "sequelize";
import { getBalance } from "../utils/alchemy";
require("dotenv-flow").config();

const sequelize = new Sequelize(process.env.DB_URI!);

sequelize.define("participation", {
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  minEth: {
    type: DataTypes.DECIMAL,
  },
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  cheating: {
    type: DataTypes.BOOLEAN,
  },
});

const GET_PARTICIPATIONS = `
SELECT u.address, ph."minEth", p.id, p.cheating
FROM "participant" as "p"
LEFT JOIN "user" as "u" ON p."userId" = u.id
LEFT JOIN "phases" as "ph" ON p."phaseId" = ph.id
WHERE p."deletedAt" = null
`;

const checkEthBalance = async () => {
  try {
    const participataions = await sequelize.query(GET_PARTICIPATIONS, {
      type: QueryTypes.SELECT,
      model: sequelize.models.participation,
    });

    participataions.forEach(async (participation) => {
      const { address, cheating, id, minEth } = participation.get();

      const balanceInWei = await getBalance(address);
      const requiredBalanceInWei = String(minEth * 10 ** 18);

      const paddedBalance = balanceInWei.padStart(
        requiredBalanceInWei.length,
        "0"
      );
      const paddedRequiredBalance = requiredBalanceInWei.padStart(
        balanceInWei.length,
        "0"
      );

      if (paddedBalance <= paddedRequiredBalance) {
        await sequelize.query(
          `UPDATE participant SET cheating = true WHERE id = ${id}`,
          {
            type: QueryTypes.UPDATE,
          }
        );
      } else if (cheating) {
        await sequelize.query(
          `UPDATE participant SET cheating = false WHERE id = ${id}`,
          {
            type: QueryTypes.UPDATE,
          }
        );
      }
    });
  } catch (error) {
    console.error(error);
  }
};

setInterval(checkEthBalance, 600_000);
