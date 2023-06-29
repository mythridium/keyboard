interface BaseSkillData {
    /** IDs of pets to register to skill */
    pets?: string[];
    /** Rare drops that may drop on each action of the skill */
    rareDrops?: RareSkillDropData[];
    /** Information on what should appear on a skill's minibar */
    minibar?: MinibarData;
    /** Custom milestones that are not autogenerated */
    customMilestones?: MilestoneData[];
}
interface RareSkillDropData {
    /** Item that drops */
    itemID: string;
    altItemID?: string;
    /** The quantity of the item that drops */
    quantity: number;
    /** Chance for the drop */
    chance: RareSkillDropChance;
    /** Requirements for the drop */
    requirements: AnyRequirementData[];
}
declare type RareSkillDropChance = FixedSkillDropChance | LevelScalingSkillDropChance | TotalMasteryScalingSkillDropChance;
declare type FixedSkillDropChance = {
    type: 'Fixed';
    chance: number;
};
interface ScalingChance {
    baseChance: number;
    scalingFactor: number;
    maxChance: number;
}
interface LevelScalingSkillDropChance extends ScalingChance {
    type: 'LevelScaling';
}
interface TotalMasteryScalingSkillDropChance extends ScalingChance {
    type: 'TotalMasteryScaling';
}
interface RareSkillDrop {
    /** The item that drops */
    item: AnyItem;
    altItem?: AnyItem;
    /** The quantity of the item that drops */
    quantity: number;
    /** The chance for the item to drop */
    chance: RareSkillDropChance;
    /** The requirements for the item to drop */
    requirements: AnyRequirement[];
}
interface MinibarData {
    /** Items that by default should be in the minibar item selection */
    defaultItems: string[];
    /** Shop Upgrades that should display on the minibar */
    upgrades: string[];
    /** Pets that should display on the minibar */
    pets: string[];
}
interface MinibarOptions {
    defaultItems: Set<EquipmentItem>;
    upgrades: ShopPurchase[];
    pets: Pet[];
}
declare class SkillRenderQueue {
    xp: boolean;
    level: boolean;
    xpCap: boolean;
    /** The previous level that was rendered */
    previousLevel: number;
    lock: boolean;
}
/** Base class for all skills */
declare abstract class Skill<DataType extends BaseSkillData> extends NamespacedObject implements EncodableObject {
    /** Game object to which this skill is registered to */
    game: Game;
    /** Readonly. Returns the current level of the skill. */
    get level(): number;
    /** Readonly. Returns the current xp of the skill */
    get xp(): number;
    /** Readonly. Returns the percent progress of the skill to the next level */
    get nextLevelProgress(): number;
    /** Readonly. Localized name of skill */
    get name(): string;
    /** Readonly: URL of skills icon image */
    get media(): string;
    get hasMastery(): boolean;
    /** If the skill is a combat skill or not */
    get isCombat(): boolean;
    /** Readonly: If the skill has a Skilling Minibar */
    get hasMinibar(): boolean;
    /** Pets that can be rolled after completing an action for the skill */
    pets: Pet[];
    /** Rare item drops that occur on an action */
    rareDrops: RareSkillDrop[];
    minibarOptions: MinibarOptions;
    milestones: MilestoneLike[];
    /** Sorts the milestones by skill level (ascending) */
    sortMilestones(): void;
    /** Readonly. Returns the current virtual level of the skill */
    get virtualLevel(): number;
    /** Maximum skill level achievable */
    get levelCap(): 120 | 99;
    /** The level the skill should start at */
    get startingLevel(): number;
    /** Maximum skill level achievable during the tutorial */
    get tutorialLevelCap(): number;
    get isUnlocked(): boolean;
    /** Stores the current level of the skill */
    _level: number;
    /** Stores the current xp of the skill */
    _xp: number;
    /** Stores if the skill is unlocked */
    _unlocked: boolean;
    /** Media of string without CDN */
    abstract readonly _media: string;
    abstract renderQueue: SkillRenderQueue;
    constructor(namespace: DataNamespace, id: string, 
    /** Game object to which this skill is registered to */
    game: Game);
    getItemForRegistration(id: string): AnyItem;
    onLoad(): void;
    render(): void;
    renderXP(): void;
    renderLevel(): void;
    renderLockStatus(): void;
    fireLevelUpModal(previousLevel: number): void;
    getNewMilestoneHTML(previousLevel: number): string;
    /** Rendering for the xp cap message */
    renderXPCap(): void;
    /**
     * Adds experience to the skill
     * @param amount The unmodified experience to add
     * @param masteryAction Optional, the action the xp came from
     * @returns True if the xp added resulted in a level increase
     */
    addXP(amount: number, masteryAction?: NamespacedObject): boolean;
    /** Caps skill experience during the tutorial */
    capXPForTutorial(): void;
    /** Caps skill experience based on the current gamemode */
    capXPForGamemode(): void;
    /** Method for performing a level up on this skill */
    levelUp(): void;
    /**
     * Gets the modified xp to add to the skill
     * @param amount The unmodified experience
     * @param masteryAction Optional, the action the xp came from
     * @returns The experience with modifiers applied
     */
    modifyXP(amount: number, masteryAction?: NamespacedObject): number;
    /**
     * Gets the percentage xp modifier for a skill
     * @param masteryAction Optional, the action the xp came from
     */
    getXPModifier(masteryAction?: NamespacedObject): number;
    /** Gets the uncapped doubling chance for this skill.
     *  This should be overrode to add skill specific bonuses
     */
    getUncappedDoublingChance(action?: NamespacedObject): number;
    /** Gets the clamped doubling chance for this skill */
    getDoublingChance(action?: NamespacedObject): number;
    /** Gets the gp gain modifier for this skill */
    getGPModifier(action?: NamespacedObject): number;
    /** Sets the experience of the skill to the specified value */
    setXP(value: number): void;
    setUnlock(isUnlocked: boolean): void;
    /** Callback function for attempted to unlock the skill */
    unlockOnClick(): void;
    rollForPets(interval: number): void;
    /** Method called when skill is leveled up */
    onLevelUp(oldLevel: number, newLevel: number): void;
    rollForRareDrops(level: number, rewards: Rewards): void;
    getRareDropChance(level: number, chance: RareSkillDropChance): number;
    /** Callback function for showing the milestones for this skill */
    openMilestoneModal(): void;
    encode(writer: SaveWriter): SaveWriter;
    decode(reader: SaveWriter, version: number): void;
    convertOldXP(xp: number): void;
    registerData(namespace: DataNamespace, data: DataType): void;
    /** Method called after all game data has been registered. */
    postDataRegistration(): void;
    testTranslations(): void;
}
interface ActionMastery {
    xp: number;
    level: number;
}
interface MasteryLevelUnlockData {
    /** Utilized only for game bonuses, gives language ID */
    descriptionID?: number;
    description: string;
    level: number;
}
declare class MasteryLevelUnlock {
    skill: SkillWithMastery<MasteryAction, MasterySkillData>;
    level: number;
    get description(): string;
    _descriptionID?: number;
    _description: string;
    constructor(data: MasteryLevelUnlockData, skill: SkillWithMastery<MasteryAction, MasterySkillData>);
}
/** Base Data type for skills which have mastery */
interface MasterySkillData extends BaseSkillData {
    masteryTokenID?: string;
    masteryLevelUnlocks?: MasteryLevelUnlockData[];
}
declare class MasterySkillRenderQueue<ActionType extends MasteryAction> extends SkillRenderQueue {
    actionMastery: Set<ActionType>;
    masteryPool: boolean;
}
/** Base class for skills that have mastery */
declare abstract class SkillWithMastery<ActionType extends MasteryAction, DataType extends MasterySkillData> extends Skill<DataType> implements Action {
    get hasMastery(): boolean;
    actions: NamespaceRegistry<ActionType>;
    actionMastery: Map<MasteryAction, ActionMastery>;
    _masteryPoolXP: number;
    get masteryLevelCap(): number;
    /** The mastery token for this skill. Must be registered as data. */
    masteryToken?: TokenItem;
    /** Readonly. Returns the percent of the base mastery pool xp the skill an reach */
    get masteryPoolCapPercent(): number;
    /** Readonly. Returns the base mastery pool xp cap the skill has */
    get baseMasteryPoolCap(): number;
    /** Readonly. Returns the maximum amount of Mastery Pool XP the skill can have */
    get masteryPoolCap(): number;
    /** Readonly. Returns the current Mastery Pool XP the skill has */
    get masteryPoolXP(): number;
    /** The chance to recieve a mastery token for this skill per action */
    get masteryTokenChance(): number;
    abstract renderQueue: MasterySkillRenderQueue<ActionType>;
    /** Sorted array of all mastery actions for the skill */
    sortedMasteryActions: ActionType[];
    masteryLevelUnlocks: MasteryLevelUnlock[];
    totalMasteryActions: CompletionMap;
    _totalCurrentMasteryLevel: CompletionMap;
    toStrang?: Pet;
    onLoad(): void;
    abstract getErrorLog(): string;
    onPageChange(): void;
    onPageVisible?(): void;
    onPageLeave?(): void;
    renderModifierChange(): void;
    queueBankQuantityRender?(item: AnyItem): void;
    /**
     * @description Rendering hook for when skill modifiers change
     * @deprecated This method will be removed in an upcoming major update. Use renderModifierChange instead.
     */
    onModifierChange(): void;
    render(): void;
    renderActionMastery(): void;
    renderMasteryPool(): void;
    /**
     * Callback function to level up a mastery with pool xp
     * @param action The action object to level up
     * @param levels The number of levels to increase the action by
     */
    levelUpMasteryWithPoolXP(action: ActionType, levels: number): void;
    exchangePoolXPForActionXP(action: ActionType, xpToAdd: number): void;
    /**
     * Adds mastery xp and mastery pool xp for completing an action with the given interval
     * @param action The action object to give mastery xp to
     * @param interval The interval of the action performed
     */
    addMasteryForAction(action: ActionType, interval: number): void;
    /**
     * Adds mastery xp for the specified action
     * @param action The action object to give mastery xp to
     * @param xp The experience to add to the action. Modifiers will not be applied.
     * @returns True, if the mastery level was increased
     */
    addMasteryXP(action: ActionType, xp: number): boolean;
    onMasteryLevelUp(action: ActionType, oldLevel: number, newLevel: number): void;
    /** Fires a modal indicating the skill has reached the maximum mastery level */
    fireMaximumMasteryModal(): void;
    /** Method fired when a mastery pool bonus is lost/gained */
    onMasteryPoolBonusChange(oldBonusLevel: number, newBonusLevel: number): void;
    wasPoolBonusChanged(oldBonusLevel: number, newBonusLevel: number, tier: number): boolean;
    addMasteryPoolXP(xp: number): void;
    /** Gets if a particular mastery pool tier active */
    isPoolTierActive(tier: number): boolean;
    /** Gets the change in mastery pool bonus level if xp is added/removed */
    getPoolBonusChange(xp: number): number;
    /** Gets the level of mastery pool bonus active based on an amount of pool xp */
    getMasteryCheckPointLevel(xp: number): number;
    updateTotalCurrentMasteryLevel(): void;
    /** Returns the sum of all current mastery levels */
    get totalCurrentMasteryLevel(): number;
    getTotalCurrentMasteryLevels(namespace: string): number;
    getMaxTotalMasteryLevels(namespace: string): number;
    addTotalCurrentMasteryToCompletion(completion: CompletionMap): void;
    /** The maximum total mastery level obtainable for the skill */
    get trueMaxTotalMasteryLevel(): number;
    /** Readonly. Returns the total amount of mastery XP earned for the skill */
    get totalMasteryXP(): number;
    /** Returns the total number of actions that have mastery that are currently unlocked */
    totalUnlockedMasteryActions: number;
    /** Calculates the numer of mastery actions unlocked for this skill. By default, updated on skill level up. */
    abstract getTotalUnlockedMasteryActions(): number;
    /** Returns the total number of actions that have mastery for this skill */
    get trueTotalMasteryActions(): number;
    /** Gets the mastery pool progress for the skill in %  */
    get masteryPoolProgress(): number;
    /**
     * Gets the modified mastery xp to add for performing an action.
     * @param action The action object to compute mastery xp for
     * @param interval The interval of the action performed
     * @returns The modified XP to add
     */
    getMasteryXPToAddForAction(action: ActionType, interval: number): number;
    /**
     * Gets the base mastery xp to add for performing an action.
     * @param action The action object to compute mastery xp for
     * @param interval The interval of the action performed
     * @returns The modified XP to add
     */
    getBaseMasteryXPToAddForAction(action: ActionType, interval: number): number;
    /**
     * Gets the mastery XP to add to the pool for performing an action
     * @param xp The modified action mastery xp
     * @returns The mastery XP to add to the pool
     */
    getMasteryXPToAddToPool(xp: number): number;
    getMasteryXPModifier(action: ActionType): number;
    getMasteryLevel(action: ActionType): number;
    getMasteryXP(action: ActionType): number;
    get isAnyMastery99(): boolean;
    /** Gets the flat change in [ms] for the given masteryID */
    getFlatIntervalModifier(action: ActionType): number;
    /** Gets the percentage change in interval for the given masteryID */
    getPercentageIntervalModifier(action: ActionType): number;
    modifyInterval(interval: number, action: ActionType): number;
    constructor(namespace: DataNamespace, id: string, game: Game);
    onLevelUp(oldLevel: number, newLevel: number): void;
    registerData(namespace: DataNamespace, data: DataType): void;
    postDataRegistration(): void;
    computeTotalMasteryActions(): void;
    getMasteryProgress(action: ActionType): MasteryProgress;
    /** Updates all mastery displays in the DOM for the given action */
    updateMasteryDisplays(action: ActionType): void;
    /** Callback function for opening the spend mastery xp modal */
    openSpendMasteryXPModal(): void;
    /** Callback function for opening the mastery level unlocks modal */
    openMasteryLevelUnlockModal(): void;
    /** Callback function for opening the mastery pool bonus modal */
    openMasteryPoolBonusModal(): void;
    /** Rolls for all pets that have been registered to the skill */
    rollForPets(interval: number): void;
    encode(writer: SaveWriter): SaveWriter;
    decode(reader: SaveWriter, version: number): void;
    /** Converts the old mastery array for the skill */
    convertOldMastery(oldMastery: OldMasteryData, idMap: NumericIDMap): void;
    abstract getActionIDFromOldID(oldActionID: number, idMap: NumericIDMap): string;
}
interface MasteryProgress {
    xp: number;
    level: number;
    percent: number;
    nextLevelXP: number;
}
/** Base class for gathering skills. E.g. Skills that return resources but does not consume them. */
declare abstract class GatheringSkill<ActionType extends MasteryAction, DataType extends MasterySkillData> extends SkillWithMastery<ActionType, DataType> implements ActiveAction, Serializable {
    /** Timer for skill action */
    actionTimer: Timer;
    abstract renderQueue: GatheringSkillRenderQueue<ActionType>;
    /** If the skill is the currently active skill */
    isActive: boolean;
    get activeSkills(): this[];
    /** Returns if the skill can currently stop */
    get canStop(): boolean;
    /** Gets the rewards for the current action of the skill */
    abstract readonly actionRewards: Rewards;
    /** Gets the interval for the next action to perform */
    abstract readonly actionInterval: number;
    /** Gets the level for the current action of the skill */
    abstract readonly actionLevel: number;
    /** Mastery Object for the currently running action */
    abstract readonly masteryAction: ActionType;
    /** If the action state should be reset after save load */
    shouldResetAction: boolean;
    /** Mastery Level for the currently running action */
    get masteryLevel(): number;
    /** Gets the interval of the currently running action in [ms] */
    get currentActionInterval(): number;
    /** Modified interval for mastery XP/summoning calculations */
    abstract masteryModifiedInterval: number;
    /** Is the potion for the skill active */
    get isPotionActive(): boolean;
    get activePotion(): PotionItem | undefined;
    /** Processes a tick of time for the skill */
    activeTick(): void;
    /** Rendering hook for when the player's equipment changes */
    abstract onEquipmentChange(): void;
    onPageChange(): void;
    onModifierChangeWhileActive?(): void;
    /** Performs rendering for the skill */
    render(): void;
    /** Gets debugging information for the skill */
    getErrorLog(): string;
    /** Starts up the skill with whatever selections have been made. Returns true if the skill was successfully started. */
    start(): boolean;
    /** Returns true if action stopped successfully */
    stop(): boolean;
    /** Method that occurs on stopping a skill, but before saving.
     *  Usage is for state changes required
     */
    onStop(): void;
    /** Starts the timer for the skill with the actionInterval */
    startActionTimer(): void;
    /** Hook for state mutatations at start of action */
    abstract preAction(): void;
    /** Hook for state mutatations at end of action
     *  Things that should go here:
     *  Potion Usage, Glove Charge Usage, Action/Interval Statistics
     *  Renders required after an action
     *  Tutorial Tracking
     */
    abstract postAction(): void;
    /** Performs the main action for the skill, then determines if it should continue */
    action(): void;
    /** Addes rewards to player, returns false if skill should stop */
    addActionRewards(): boolean;
    /** Rolls to add a mastery token to action rewards */
    addMasteryToken(rewards: Rewards): void;
    /** Adds rewards that are common to all skills for a successful action */
    addCommonRewards(rewards: Rewards): void;
    /** Adds the mastery XP reward for the current action */
    addMasteryXPReward(): void;
    resetActionState(): void;
    encode(writer: SaveWriter): SaveWriter;
    decode(reader: SaveWriter, version: number): void;
    /** Deserializes the skills state data */
    deserialize(reader: DataReader, version: number, idMap: NumericIDMap): void;
}
/** Base class for crafting skills. E.g. Skills that consume resources to make other resources. */
declare abstract class CraftingSkill<T extends MasteryAction, DataType extends MasterySkillData> extends GatheringSkill<T, DataType> {
    /** Gets the costs for the currently selected recipe */
    abstract getCurrentRecipeCosts(): Costs;
    /** Gets the ingredient preservation chance for the currently selected recipe */
    get actionPreservationChance(): number;
    /** Records statistics for preserving resources */
    abstract recordCostPreservationStats(costs: Costs): void;
    /** Records statistics for consuming resources */
    abstract recordCostConsumptionStats(costs: Costs): void;
    /** Gets the message for when the player does not have the required costs for an action */
    abstract noCostsMessage: string;
    /** Gets the preservation chance for the skill for a given masteryID */
    getPreservationChance(action: T, chance: number): number;
    getPreservationCap(): number;
    /** Performs the main action for the skill, stopping if the required resources are not met */
    action(): void;
}
declare class DummyActiveAction extends NamespacedObject implements ActiveAction {
    get name(): string;
    get media(): string;
    get activeSkills(): AnySkill[];
    getErrorLog(): string;
    isActive: boolean;
    stop(): boolean;
    activeTick(): void;
    constructor(dummyData: DummyData);
}
interface BasicSkillRecipeData extends IDData {
    baseExperience: number;
    level: number;
}
/** Base class for skill recipes with a level requirement and fixed xp */
declare abstract class BasicSkillRecipe extends MasteryAction {
    baseExperience: number;
    level: number;
    constructor(namespace: DataNamespace, data: BasicSkillRecipeData);
}
interface SingleProductRecipeData extends BasicSkillRecipeData {
    productId: string;
}
/** Base class for skill recipes that produce a single product item */
declare class SingleProductRecipe extends BasicSkillRecipe {
    get name(): string;
    get media(): string;
    product: AnyItem;
    constructor(namespace: DataNamespace, data: SingleProductRecipeData, game: Game);
}
interface SkillCategoryData extends IDData {
    media: string;
    name: string;
}
declare class SkillCategory extends NamespacedObject {
    skill: AnySkill;
    get media(): string;
    get name(): string;
    _name: string;
    _media: string;
    constructor(namespace: DataNamespace, data: SkillCategoryData, skill: AnySkill);
}
declare class GatheringSkillRenderQueue<ActionType extends MasteryAction> extends MasterySkillRenderQueue<ActionType> {
    progressBar: boolean;
}
declare type ItemCurrencyObject = {
    items: AnyItemQuantity[];
    gp: number;
    sc: number;
};
/** Class to manage the item, gp, and slayer coin costs of crafting skills */
declare class Costs {
    game: Game;
    get gp(): number;
    get sc(): number;
    get raidCoins(): number;
    _items: Map<AnyItem, number>;
    _gp: number;
    _sc: number;
    _raidCoins: number;
    constructor(game: Game);
    /** Adds an item by its unique string identifier */
    addItemByID(itemID: string, quantity: number): void;
    addItem(item: AnyItem, quantity: number): void;
    addGP(amount: number): void;
    addSlayerCoins(amount: number): void;
    addRaidCoins(amount: number): void;
    /**
     * Gets an ItemQuantity array to interface with UI classes
     */
    getItemQuantityArray(): AnyItemQuantity[];
    /** Increments the stat provided by the gp cost */
    recordGPStat(tracker: StatTracker, stat: number): void;
    /** Increments the stat provided by the slayer coin cost */
    recordSCStat(tracker: StatTracker, stat: number): void;
    /** Increments the stat provided by the quantity of all item costs */
    recordBulkItemStat(tracker: StatTracker, stat: number): void;
    /** Increments the stat provided by the base sale cost of all item costs */
    recordBulkItemValueStat(tracker: StatTracker, stat: number): void;
    /** Increments the Item stat provided for all item costs by their quantity */
    recordIndividualItemStat(stat: ItemStats): void;
    /** Resets all stored costs */
    reset(): void;
    /** Checks if the player has all the costs */
    checkIfOwned(): boolean;
    /** Consumes all the stored costs from the player */
    consumeCosts(): void;
}
/** Class to manage the gain of rewards from crafting skills */
declare class Rewards extends Costs {
    source: string;
    _xp: Map<AnySkill, number>;
    addXP(skill: AnySkill, amount: number): void;
    getXP(skill: AnySkill): number;
    /** Gives the currently set rewards to the player, returns true if not all items were given */
    giveRewards(): boolean;
    /** Forcefully gives the currently set rewards to the player, ignoring bank space for the items */
    forceGiveRewards(): boolean;
    reset(): void;
    setSource(source: string): void;
}
declare type AnySkill = Skill<any>;
