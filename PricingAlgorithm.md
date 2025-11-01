DYNAMIC PRICING CALCULATION LOGIC

Step 1: Retrieve Active Events
- Fetch all events currently marked with the status "ACTIVE".

Step 2: Compute Factor Inputs
- Before calculating the dynamic price, determine the input metrics for each factor:

  2.1 Time Factor:  
      Calculate the number of days remaining until the event date (eventDate - currentDate).

  2.2 Inventory Factor:  
      Determine the ratio of remaining tickets:  
      remainingTickets / totalTickets.

  2.3 Demand Factor:  
      Count the number of bookings made within the last configured time window (for example, the last 1 hour).


Step 3: Calculate Factor Adjustments
- Derive the contribution of each factor toward the final adjustment percentage.

  3.1 Determine Dynamic Percentage per Factor:  
      Based on the values obtained from Step 2, identify the corresponding dynamic percentage for each factor using the configured rule ranges.

  3.2 Apply Factor Weights:  
      Multiply the weight (static value from environment variables) of each factor with its respective percentage to compute the weighted percentage.

  3.3 Compute Factor Amounts:  
      Multiply each weighted percentage with the basePrice to get the monetary adjustment.

      The result should include:
          basePrice
          timePercent
          timeAmount
          demandPercent
          demandAmount
          inventoryPercent
          inventoryAmount
          totalAdjustment


Step 4: Derive the New Price
- Calculate the preliminary adjusted price using the formula:
newPrice = basePrice * (1 + totalAdjustment)

Step 5: Apply Floor and Ceiling Constraints
- Ensure that the final price remains within the allowed range.

  5.1 Cap the Price:
      cappedPrice = max(floorPrice, min(ceilingPrice, newPrice))

  5.2 Compare Prices:
      If cappedPrice == newPrice:
          Proceed to Step 7
      Else:
          Proceed to Step 6 for recalibration


Step 6: Recalculate Adjustments for Capped Price
- If the price was capped, proportionally adjust each factor.

  6.1 Compute Adjustment Percent:
      adjustmentPercent = (cappedPrice - basePrice) / basePrice

  6.2 Determine Scaling Ratio:
      scalingPercent = adjustmentPercent / totalAdjustment

  6.3 Rescale Factors:
      Multiply each factor’s percent and amount by scalingPercent to maintain proportional contribution.


Step 7: Persist the Updated Price
- Compare the new price with the current price in the database.

      If newPrice != currentPrice:
          Update the database with new price and detailed breakdown
      Else:
          End process (no change required)