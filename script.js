document.addEventListener('DOMContentLoaded', () => {
    const heroList = document.getElementById('hero-list');
    const heroName = document.getElementById('hero-name');
    const abilitiesDiv = document.getElementById('abilities');
    const skillChain = document.getElementById('skill-chain');
    const skillChainConstructor = document.getElementById('skill-chain-constructor');
    const totalStunDurationElement = document.createElement('p');
    const totalSilenceDurationElement = document.createElement('p');
    const totalRootDurationElement = document.createElement('p');

    totalStunDurationElement.id = 'total-stun-duration';
    totalSilenceDurationElement.id = 'total-silence-duration';
    totalRootDurationElement.id = 'total-root-duration';
    skillChain.appendChild(totalStunDurationElement);
    skillChain.appendChild(totalSilenceDurationElement);
    skillChain.appendChild(totalRootDurationElement);

    const abilityFilters = document.getElementsByName('ability-filter');
    const cooldownFilters = document.getElementsByName('cooldown-filter');

    const heroes = [
        'abathur.json',
        'alarak.json',
        'alexstrasza.json',
        'ana.json',
        'anduin.json',
        'anubarak.json',
        'artanis.json',
        'arthas.json',
        'auriel.json',
        'azmodan.json',
        'blaze.json',
        'brightwing.json',
        'cassia.json',
        'chen.json',
        'chogall.json',
        'chromie.json',
        'deathwing.json',
        'deckard.json',
        'dehaka.json',
        'diablo.json',
        'dva.json',
        'etc.json',
        'falstad.json',
        'fenix.json',
        'gall.json',
        'garrosh.json',
        'gazlowe.json',
        'genji.json',
        'greymane.json',
        'guldan.json',
        'hanzo.json',
        'hogger.json',
        'illidan.json',
        'imperius.json',
        'jaina.json',
        'johanna.json',
        'junkrat.json',
        'kaelthas.json',
        'kelthuzad.json',
        'kerrigan.json',
        'kharazim.json',
        'leoric.json',
        'lili.json',
        'liming.json',
        'lostvikings.json',
        'ltmorales.json',
        'lucio.json',
        'lunara.json',
        'maiev.json',
        'malfurion.json',
        'malganis.json',
        'malthael.json',
        'medivh.json',
        'mei.json',
        'mephisto.json',
        'muradin.json',
        'murky.json',
        'nazeebo.json',
        'nova.json',
        'orphea.json',
        'probius.json',
        'qhira.json',
        'ragnaros.json',
        'raynor.json',
        'rehgar.json',
        'rexxar.json',
        'samuro.json',
        'sgthammer.json',
        'sonya.json',
        'stitches.json',
        'stukov.json',
        'sylvanas.json',
        'tassadar.json',
        'thebutcher.json',
        'thrall.json',
        'tracer.json',
        'tychus.json',
        'tyrael.json',
        'tyrande.json',
        'uther.json',
        'valeera.json',
        'valla.json',
        'varian.json',
        'whitemane.json',
        'xul.json',
        'yrel.json',
        'zagara.json',
        'zarya.json',
        'zeratul.json',
        'zuljin.json'
    ];

    const excludedAbilities = [
        'Soothing Mist',
        'Dragonqueen',
        'Wrath of the Berserker',
        'Black Arrows'
    ];

    const loadHeroes = async () => {
        for (const hero of heroes) {
            try {
                const response = await fetch(`hero/${hero}`);
                const heroData = await response.json();
                if (heroData.name === 'Jaina') {
                    for (const abilitySet in heroData.abilities) {
                        heroData.abilities[abilitySet] = heroData.abilities[abilitySet].filter(ability => !excludedAbilities.includes(ability.name));
                        heroData.abilities[abilitySet].forEach(ability => {
                            ability.description += ' Slows by 4 sec.';
                        });
                    }
                } else {
                    for (const abilitySet in heroData.abilities) {
                        heroData.abilities[abilitySet] = heroData.abilities[abilitySet].filter(ability => !excludedAbilities.includes(ability.name));
                    }
                }
                const heroCard = createHeroCard(heroData);
                heroList.appendChild(heroCard);
                heroCard.dataset.heroData = JSON.stringify(heroData); // Save hero data to card for filtering
            } catch (error) {
                console.error(`Error loading hero data for ${hero}:`, error);
            }
        }
    };

    const createHeroCard = (heroData) => {
        const heroCard = document.createElement('div');
        heroCard.classList.add('hero-card');
        heroCard.innerHTML = `
            <img src="images/heroes/${heroData.icon}" alt="${heroData.name}" title="${heroData.name}">
        `;
        heroCard.addEventListener('click', () => loadHeroDetails(heroData));
        return heroCard;
    };

    const loadHeroDetails = (heroData) => {
        heroName.innerText = heroData.name;
        abilitiesDiv.innerHTML = '';
        for (const abilitySet in heroData.abilities) {
            heroData.abilities[abilitySet].forEach(ability => {
                if (shouldShowAbility(ability)) {
                    const abilityCard = createAbilityCard(ability);
                    abilitiesDiv.appendChild(abilityCard);
                }
            });
        }
        skillChain.style.display = 'block';
    };

    const createAbilityCard = (ability) => {
        const stunDuration = getStunDuration(ability.description);
        const silenceDuration = getSilenceDuration(ability.description);
        const slowDuration = getSlowDuration(ability.description);
        const rootDuration = getRootDuration(ability.description);

        const abilityCard = document.createElement('div');
        abilityCard.classList.add('ability-card');
        abilityCard.innerHTML = `
            <img src="images/talents/${ability.icon}" alt="${ability.name}">
            <div>
                <h4>${ability.name}</h4>
                <p>${ability.description}</p>
                ${stunDuration ? `<span class="duration stun-duration">Stun: ${stunDuration} sec</span>` : ''}
                ${silenceDuration ? `<span class="duration silence-duration">Silence: ${silenceDuration} sec</span>` : ''}
                ${slowDuration ? `<span class="duration slow-duration">Slow: ${slowDuration} sec</span>` : ''}
                ${rootDuration ? `<span class="duration root-duration">Root: ${rootDuration} sec</span>` : ''}
            </div>
        `;
        abilityCard.dataset.stunDuration = stunDuration || 0;
        abilityCard.dataset.silenceDuration = silenceDuration || 0;
        abilityCard.dataset.slowDuration = slowDuration || 0;
        abilityCard.dataset.rootDuration = rootDuration || 0;
        abilityCard.addEventListener('click', () => {
            addAbilityToChain(ability);
        });
        return abilityCard;
    };

    const getStunDuration = (description) => {
        const stunMatch = description.match(/stun.*?(\d+(\.\d+)?)\s*sec/i);
        return stunMatch ? parseFloat(stunMatch[1]) : null;
    };

    const getSilenceDuration = (description) => {
        const silenceMatch = description.match(/(silence|silencing).*?(\d+(\.\d+)?)\s*sec/i);
        return silenceMatch ? parseFloat(silenceMatch[2]) : null;
    };

    const getSlowDuration = (description) => {
        const slowMatch = description.match(/(slow|slowed|slowing|slows).*?(\d+(\.\d+)?)\s*sec/i);
        return slowMatch ? parseFloat(slowMatch[2]) : null;
    };

    const getRootDuration = (description) => {
        const rootMatch = description.match(/(root|draws).*?(\d+(\.\d+)?)\s*sec/i);
        return rootMatch ? parseFloat(rootMatch[2]) : null;
    };

    const shouldShowAbility = (ability) => {
        const abilityFilter = document.querySelector('input[name="ability-filter"]:checked').value;
        const cooldownFilter = document.querySelector('input[name="cooldown-filter"]:checked').value;
        const desc = ability.description.toLowerCase();

        if (abilityFilter === 'stun' && (!(desc.includes('stun') && desc.includes('sec')))) {
            return false;
        }
        if (abilityFilter === 'displace' && !(desc.includes('pull') || desc.includes('knock') || desc.includes('knocked') || desc.includes('knocking') || desc.includes('pulled'))) {
            return false;
        }
        if (abilityFilter === 'silence' && !(desc.includes('silence') || desc.includes('silencing') && desc.includes('sec'))) {
            return false;
        }
        if (abilityFilter === 'slow' && !(desc.includes('slow') || desc.includes('slowed') || desc.includes('slowing') || desc.includes('slows') && desc.includes('sec'))) {
            return false;
        }
        if (abilityFilter === 'root' && !(desc.includes('root') || desc.includes('draws') && desc.includes('sec'))) {
            return false;
        }

        if (cooldownFilter === '10' && ability.cooldown > 10) {
            return false;
        }
        if (cooldownFilter === '16' && (ability.cooldown <= 10 || ability.cooldown > 16)) {
            return false;
        }
        if (cooldownFilter === 'more-than-16' && ability.cooldown <= 16) {
            return false;
        }
        return true;
    };

    const filterHeroes = () => {
        document.querySelectorAll('.hero-card').forEach(heroCard => {
            const heroData = JSON.parse(heroCard.dataset.heroData);
            const hasFilteredAbility = Object.values(heroData.abilities).some(abilitySet => 
                abilitySet.some(ability => shouldShowAbility(ability))
            );
            heroCard.style.display = hasFilteredAbility ? 'block' : 'none';
        });
    };

    const updateTotalDurations = () => {
        let totalStunDuration = 0;
        let totalSilenceDuration = 0;
        let totalRootDuration = 0;
        skillChainConstructor.querySelectorAll('.ability-card').forEach(card => {
            totalStunDuration += parseFloat(card.dataset.stunDuration || 0);
            totalSilenceDuration += parseFloat(card.dataset.silenceDuration || 0);
            totalRootDuration += parseFloat(card.dataset.rootDuration || 0);
        });
        totalStunDurationElement.innerText = `Total Stun Duration: ${totalStunDuration} sec`;
        totalSilenceDurationElement.innerText = `Total Silence Duration: ${totalSilenceDuration} sec`;
        totalRootDurationElement.innerText = `Total Root Duration: ${totalRootDuration} sec`;
    };

    const addAbilityToChain = (ability) => {
        const stunDuration = getStunDuration(ability.description);
        const silenceDuration = getSilenceDuration(ability.description);
        const slowDuration = getSlowDuration(ability.description);
        const rootDuration = getRootDuration(ability.description);
        const abilityCard = document.createElement('div');
        abilityCard.classList.add('ability-card');
        abilityCard.innerHTML = `
            <img src="images/talents/${ability.icon}" alt="${ability.name}">
            <div>
                <h4>${ability.name}</h4>
                ${stunDuration ? `<span class="duration stun-duration">Stun: ${stunDuration} sec</span>` : ''}
                ${silenceDuration ? `<span class="duration silence-duration">Silence: ${silenceDuration} sec</span>` : ''}
                ${slowDuration ? `<span class="duration slow-duration">Slow: ${slowDuration} sec</span>` : ''}
                ${rootDuration ? `<span class="duration root-duration">Root: ${rootDuration} sec</span>` : ''}
            </div>
            <button class="remove-skill">X</button>
        `;
        abilityCard.dataset.stunDuration = stunDuration || 0;
        abilityCard.dataset.silenceDuration = silenceDuration || 0;
        abilityCard.dataset.slowDuration = slowDuration || 0;
        abilityCard.dataset.rootDuration = rootDuration || 0;
        abilityCard.querySelector('.remove-skill').addEventListener('click', () => {
            const index = Array.from(skillChainConstructor.children).indexOf(abilityCard);
            skillChainConstructor.removeChild(abilityCard);
            updateTotalDurations();
            if (index > 0) {
                const previousArrow = skillChainConstructor.children[(index - 1) * 2];
                skillChainConstructor.removeChild(previousArrow);
            }
        });
        skillChainConstructor.appendChild(abilityCard);
        updateTotalDurations();
        updateArrows();
    };

    const updateArrows = () => {
        const children = Array.from(skillChainConstructor.children).filter(child => child.classList.contains('ability-card'));
        children.forEach((child, index) => {
            if (index < children.length - 1) {
                if (!child.nextElementSibling || !child.nextElementSibling.classList.contains('arrow')) {
                    const arrow = document.createElement('div');
                    arrow.classList.add('arrow');
                    skillChainConstructor.insertBefore(arrow, child.nextElementSibling);
                }
            } else if (child.nextElementSibling && child.nextElementSibling.classList.contains('arrow')) {
                skillChainConstructor.removeChild(child.nextElementSibling);
            }
        });
    };

    const saveSkillChain = async () => {
        const abilities = [];
        skillChainConstructor.querySelectorAll('.ability-card').forEach(card => {
            const name = card.querySelector('h4').innerText;
            abilities.push(name);
        });
        const queryString = abilities.map((ability, index) => `ability${index}=${encodeURIComponent(ability)}`).join('&');
        const url = `${window.location.origin}${window.location.pathname}?${queryString}`;
        await navigator.clipboard.writeText(url);
        window.location.href = url;
        alert('URL saved to clipboard and page reloaded.');
    };

    document.getElementById('save-chain').addEventListener('click', saveSkillChain);

    const loadSkillChainFromUrl = async () => {
        const params = new URLSearchParams(window.location.search);
        const abilityMap = {};

        for (const hero of heroes) {
            const response = await fetch(`hero/${hero}`);
            const heroData = await response.json();
            for (const abilitySet in heroData.abilities) {
                heroData.abilities[abilitySet].forEach(ability => {
                    abilityMap[ability.name] = {
                        ...ability,
                        heroIcon: heroData.icon
                    };
                });
            }
        }

        params.forEach((value, key) => {
            if (key.startsWith('ability')) {
                const ability = abilityMap[value];
                if (ability) {
                    addAbilityToChain(ability);
                }
            }
        });
        updateTotalDurations();
    };

    abilityFilters.forEach(radio => {
        radio.addEventListener('change', () => {
            filterHeroes();
            const heroNameText = heroName.innerText;
            if (heroNameText) {
                const currentHero = JSON.parse(heroList.querySelector(`.hero-card img[alt="${heroNameText}"]`).closest('.hero-card').dataset.heroData);
                if (currentHero) {
                    loadHeroDetails(currentHero);
                }
            }
        });
    });

    cooldownFilters.forEach(radio => {
        radio.addEventListener('change', () => {
            filterHeroes();
            const heroNameText = heroName.innerText;
            if (heroNameText) {
                const currentHero = JSON.parse(heroList.querySelector(`.hero-card img[alt="${heroNameText}"]`).closest('.hero-card').dataset.heroData);
                if (currentHero) {
                    loadHeroDetails(currentHero);
                }
            }
        });
    });

    loadHeroes();
    loadSkillChainFromUrl();
});
